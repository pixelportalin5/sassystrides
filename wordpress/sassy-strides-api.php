<?php
/**
 * Plugin Name: Sassy Strides API
 * Description: High-performance cached REST endpoints for the Sassy Strides React frontend.
 * Version: 1.0.2
 * Author: Sassy Strides
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Sassy_Strides_API {
    private const NAMESPACE = 'sassy/v1';
    private const CACHE_TTL = 600;
    private const POSTS_PER_PAGE = 8;
    private const CATEGORY_ALIASES = [
        'news' => [
            'source' => 'general',
            'name' => 'News',
            'slug' => 'news',
        ],
    ];

    public static function init(): void {
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
        add_action('save_post_post', [__CLASS__, 'flush_cache']);
        add_action('deleted_post', [__CLASS__, 'flush_cache']);
        add_action('edited_category', [__CLASS__, 'flush_cache']);
        add_action('created_category', [__CLASS__, 'flush_cache']);
        add_action('delete_category', [__CLASS__, 'flush_cache']);
    }

    public static function register_routes(): void {
        register_rest_route(self::NAMESPACE, '/homepage', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_homepage'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route(self::NAMESPACE, '/category/(?P<slug>[a-zA-Z0-9-_]+)', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_category'],
            'permission_callback' => '__return_true',
            'args' => [
                'slug' => [
                    'sanitize_callback' => 'sanitize_title',
                    'required' => true,
                ],
            ],
        ]);

        register_rest_route(self::NAMESPACE, '/post/(?P<slug>[a-zA-Z0-9-_]+)', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_post'],
            'permission_callback' => '__return_true',
            'args' => [
                'slug' => [
                    'sanitize_callback' => 'sanitize_title',
                    'required' => true,
                ],
            ],
        ]);
    }

    public static function get_homepage(WP_REST_Request $request): WP_REST_Response {
        return self::cached_response('homepage_v1', function () {
            $posts = self::query_posts([
                'posts_per_page' => self::POSTS_PER_PAGE,
            ]);

            return array_map([__CLASS__, 'format_card'], $posts);
        });
    }

    public static function get_category(WP_REST_Request $request): WP_REST_Response {
        $slug = sanitize_title($request['slug']);

        return self::cached_response("category_{$slug}_v2", function () use ($slug) {
            $alias = self::CATEGORY_ALIASES[$slug] ?? null;
            $category = get_category_by_slug($alias['source'] ?? $slug);

            if (!$category) {
                return [
                    'category' => null,
                    'posts' => [],
                ];
            }

            $display_category = $alias
                ? self::format_term($category, $alias['name'], $alias['slug'])
                : self::format_term($category);
            $posts = self::query_posts([
                'cat' => (int) $category->term_id,
                'posts_per_page' => self::POSTS_PER_PAGE,
            ]);

            return [
                'category' => $display_category,
                'posts' => array_map(
                    fn ($post) => self::format_card($post, $display_category),
                    $posts
                ),
            ];
        });
    }

    public static function get_post(WP_REST_Request $request): WP_REST_Response {
        $slug = sanitize_title($request['slug']);

        return self::cached_response("post_{$slug}_v1", function () use ($slug) {
            $post = get_page_by_path($slug, OBJECT, 'post');

            if (!$post || $post->post_status !== 'publish') {
                return null;
            }

            return self::format_article($post);
        });
    }

    private static function cached_response(string $key, callable $callback): WP_REST_Response {
        $cache_key = 'sassy_api_' . md5($key);
        $data = get_transient($cache_key);

        if ($data === false) {
            $data = $callback();
            set_transient($cache_key, $data, self::CACHE_TTL);
        }

        $response = rest_ensure_response($data);
        $response->header('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=60');
        $response->header('X-Sassy-Cache-Key', $cache_key);
        self::add_cors_headers($response);

        if (function_exists('do_action')) {
            do_action('litespeed_control_set_ttl', self::CACHE_TTL);
            do_action('litespeed_control_set_cacheable', 'public');
        }

        return $response;
    }

    private static function add_cors_headers(WP_REST_Response $response): void {
        $response->header('Access-Control-Allow-Origin', '*');
        $response->header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }

    private static function query_posts(array $args): array {
        $query = new WP_Query(array_merge([
            'post_type' => 'post',
            'post_status' => 'publish',
            'ignore_sticky_posts' => true,
            'no_found_rows' => true,
            'update_post_meta_cache' => false,
            'update_post_term_cache' => true,
            'orderby' => 'date',
            'order' => 'DESC',
            'fields' => 'all',
        ], $args));

        return $query->posts;
    }

    private static function format_card(WP_Post $post, ?array $category_override = null): array {
        $category = $category_override ?: self::primary_category($post->ID);

        return [
            'id' => (int) $post->ID,
            'slug' => $post->post_name,
            'title' => html_entity_decode(get_the_title($post), ENT_QUOTES, get_bloginfo('charset')),
            'excerpt' => self::excerpt($post),
            'category' => $category,
            'image' => self::featured_image($post->ID, false),
            'date' => get_post_time(DATE_ATOM, true, $post),
        ];
    }

    private static function format_article(WP_Post $post): array {
        return [
            'id' => (int) $post->ID,
            'slug' => $post->post_name,
            'title' => html_entity_decode(get_the_title($post), ENT_QUOTES, get_bloginfo('charset')),
            'excerpt' => self::excerpt($post),
            'content' => apply_filters('the_content', $post->post_content),
            'image' => self::featured_image($post->ID, true),
            'author' => [
                'id' => (int) $post->post_author,
                'name' => get_the_author_meta('display_name', $post->post_author),
                'avatar' => get_avatar_url($post->post_author, ['size' => 96]),
            ],
            'tags' => array_map([__CLASS__, 'format_term'], wp_get_post_tags($post->ID)),
            'category' => self::primary_category($post->ID),
            'date' => get_post_time(DATE_ATOM, true, $post),
        ];
    }

    private static function featured_image(int $post_id, bool $include_full): ?array {
        $image_id = get_post_thumbnail_id($post_id);

        if (!$image_id) {
            return null;
        }

        $medium = wp_get_attachment_image_src($image_id, 'medium_large');
        $medium_fallback = wp_get_attachment_image_src($image_id, 'medium');
        $large = wp_get_attachment_image_src($image_id, 'large');
        $full = $include_full ? wp_get_attachment_image_src($image_id, 'full') : null;

        return [
            'id' => (int) $image_id,
            'url' => $medium[0] ?? $medium_fallback[0] ?? $large[0] ?? null,
            'hero' => $large[0] ?? $full[0] ?? $medium[0] ?? null,
            'full' => $include_full ? ($full[0] ?? null) : null,
            'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
            'srcset' => wp_get_attachment_image_srcset($image_id, $include_full ? 'large' : 'medium_large') ?: '',
            'sizes' => $include_full
                ? '(min-width: 1024px) 980px, 100vw'
                : '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw',
        ];
    }

    private static function primary_category(int $post_id): ?array {
        $categories = get_the_category($post_id);

        if (empty($categories)) {
            return null;
        }

        return self::format_term($categories[0]);
    }

    private static function format_term($term, ?string $name = null, ?string $slug = null): array {
        return [
            'id' => (int) $term->term_id,
            'name' => html_entity_decode($name ?: $term->name, ENT_QUOTES, get_bloginfo('charset')),
            'slug' => $slug ?: $term->slug,
        ];
    }

    private static function excerpt(WP_Post $post): string {
        $excerpt = $post->post_excerpt ?: wp_trim_words(wp_strip_all_tags($post->post_content), 28);
        return html_entity_decode($excerpt, ENT_QUOTES, get_bloginfo('charset'));
    }

    public static function flush_cache(): void {
        global $wpdb;

        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
                '_transient_sassy_api_%',
                '_transient_timeout_sassy_api_%'
            )
        );

        if (function_exists('do_action')) {
            do_action('litespeed_purge_all');
        }
    }
}

Sassy_Strides_API::init();

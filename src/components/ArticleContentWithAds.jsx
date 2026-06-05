import { Fragment, useMemo } from 'react';
import AdBanner from './AdBanner';
import { homepageAdPlacements } from '../data/homepageAds';
import { getArticleAdParagraphIndexes, splitArticleParagraphs } from '../utils/adInjection';

const ARTICLE_INLINE_ADS = [
  { paragraphIndex: 1, adId: homepageAdPlacements.afterFashion },
  { paragraphIndex: 4, adId: homepageAdPlacements.afterFeaturedStories },
];

const ArticleContentWithAds = ({ html = '' }) => {
  const paragraphs = useMemo(() => splitArticleParagraphs(html), [html]);

  const adByParagraph = useMemo(() => {
    const indexes = getArticleAdParagraphIndexes(paragraphs.length);
    const map = new Map();

    ARTICLE_INLINE_ADS.forEach((placement, slotIndex) => {
      if (indexes.includes(placement.paragraphIndex)) {
        map.set(placement.paragraphIndex, placement.adId);
      } else if (slotIndex === 0 && paragraphs.length > 1) {
        map.set(1, placement.adId);
      } else if (slotIndex === 1 && paragraphs.length > 4) {
        map.set(4, placement.adId);
      }
    });

    return map;
  }, [paragraphs.length]);

  if (!paragraphs.length) {
    return null;
  }

  return (
    <div className="article-content">
      {paragraphs.map((paragraph, index) => (
        <Fragment key={`paragraph-${index}`}>
          <div dangerouslySetInnerHTML={{ __html: paragraph }} />
          {adByParagraph.has(index) ? (
            <AdBanner adId={adByParagraph.get(index)} />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
};

export default ArticleContentWithAds;

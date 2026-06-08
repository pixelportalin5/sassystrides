import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const ContentPage = ({ title, description, children }) => (
  <div className="min-h-screen bg-ivory text-ink">
    <Navbar />

    <main className="pb-8">
      <section className="editorial-container editorial-section">
        <p className="micro-label mb-4 text-bronze">{title}</p>
        {description ? (
          <p className="mx-auto max-w-2xl text-center text-sm leading-7 text-taupe">{description}</p>
        ) : null}
        {children}
      </section>
    </main>

    <Footer />
  </div>
);

export default ContentPage;

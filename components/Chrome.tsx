import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookNowFab from "@/components/BookNowFab";

/**
 * Site-wide chrome. The fleet orbit selector and menu pages used to ship
 * their own footer, ported from the standalone fleet app, which left them
 * with a different set of links and no contact details. They now take the
 * same Nav and Footer as every other page.
 */
export default function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {/* Content stops widening past 16:9 so ultrawide monitors don't
          stretch the layout — the page background fills the sides. See
          .site-main in globals.css. */}
      <main className="site-main flex-1">{children}</main>
      <Footer />
      <BookNowFab />
    </>
  );
}

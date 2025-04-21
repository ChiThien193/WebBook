import Slider from "react-slick";
import  Header  from "./Header"; 


export function HomePage() {

  const bannerImages = [
    "https://static.vecteezy.com/system/resources/previews/022/694/707/non_2x/world-book-day-background-or-banner-design-template-vector.jpg",
    "https://www.storizen.com/wp-content/uploads/2023/04/World-Book-Day-2023-A-Tribute-to-Classic-Books-That-Never-Go-Out-of-Style-1.webp",
    "https://img.freepik.com/free-vector/flat-world-book-day-horizontal-banner-template_23-2149339898.jpg",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    arrows: false,
    fade: true,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="mt-4 max-w-6xl mx-auto px-4">
          <Slider {...settings}>
            {bannerImages.map((img, index) => (
              <div key={index} className="px-2">
                <img
                  src={img}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-[500px] object-cover rounded-lg shadow-lg focus:outline-none focus:ring-0 pointer-events-none"
                  tabIndex={-1}
                />
              </div>
            ))}
          </Slider>
        </div>
      </main>

      <footer className="py-4 mt-10" style={{ backgroundColor: "#9AA6B2", color: "#F8FAFC" }}>
        <div className="container mx-auto text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} Shop cảm ơn mọi người đã xem và ủng hộ.</p>
        </div>
      </footer>
    </div>
  );
}

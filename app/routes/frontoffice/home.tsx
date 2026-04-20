import { Button } from "~/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useTranslation } from "react-i18next";
import { useLoaderData, type MetaArgs } from "react-router";
import { getProducts } from "~/api/http-requests";
import { FeaturedProducts } from "~/components/home/featured-products";
import { useState, useEffect } from "react";

// Custom Toggle Icon Component
function ToggleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="14" rx="7" fill="currentColor" />
      <circle cx="17" cy="7" r="5" fill="white" />
    </svg>
  );
}

export function meta({ }: MetaArgs) {
  return [
    { title: "Alofo - Accueil" },
    { name: "description", content: "Bienvenue sur Alofo" },
  ];
}

export async function loader() {
  try {
    const response = await getProducts({ limit: 5 });
    // Return first 5 products for Featured Products section
    return {
      featuredProducts: response.data?.data || []
    };
  } catch (error) {
    console.error("Failed to fetch featured products", error);
    return { featuredProducts: [] };
  }
}

export default function Home() {
  const { t } = useTranslation("home");
  const { featuredProducts } = useLoaderData<typeof loader>();

  const getList = (key: string) => {
    const items = t(key, { returnObjects: true });
    return Array.isArray(items) ? items : [];
  };

  const carouselItems = getList("functionnalities.items") as any[];

  const carouselImages = [
    "/assets/home/carouselImage1.webp",
    "/assets/home/carouselImage2.webp",
    "/assets/home/carouselImage3.webp"
  ];

  const carouselGradients = [
    "linear-gradient(to bottom right, rgba(25, 135, 84, 0.5), rgba(242, 197, 114, 0.5))",
    "linear-gradient(to bottom right, rgba(255, 193, 7, 0.5), rgba(242, 197, 114, 0.5))",
    "linear-gradient(to bottom right, rgba(87, 75, 166, 0.5), rgba(242, 197, 114, 0.5))"
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, transition: { delay: 0.3, duration: 0.5 } }}
        viewport={{ once: true }}
        className="relative h-[calc(100vh-6rem)] min-h-[500px] w-full"
      >
        {/* Background Image with Scroll Attachment for Performance */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/home/header-bg.webp')" }}
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 flex items-center"
          style={{ background: "linear-gradient(to bottom right, rgba(13, 13, 13, 0.8), rgba(244, 208, 111, 0.7))" }}
        >
          <div className="container mx-auto px-4 md:px-12">
            <div className="max-w-3xl text-white">
              <h1 className="text-4xl md:text-6xl font-normal text-[#F2C572] mb-6 leading-tight">
                {t("hero.title")}
              </h1>
              <p className="text-gray-100 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl">
                {t("hero.description")}
              </p>
              <a
                href="#subscriptions"
                className="inline-flex items-center justify-center gap-2 rounded-full transition-all border border-white !bg-transparent text-white hover:bg-white hover:text-black text-lg px-8 py-2 font-light"
              >
                {t("hero.cta")}
                <span className="text-xs">▼</span>
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Categories Section ("Nous l'avons") */}
      <section className="container mx-auto px-4 pt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">{t("categories.title")}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t("categories.description")}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Baby Category */}
          <motion.div variants={fadeInUp} className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: "url('/assets/home/baby.webp')" }}
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white"
              style={{ background: "linear-gradient(to bottom left, rgba(242, 197, 114, 0.5), rgba(87, 75, 166, 0.9))" }}>
              <h3 className="text-2xl font-bold mb-2">{t("categories.items.baby.title")}</h3>
              <p className="mb-4 text-gray-100 font-medium">{t("categories.items.baby.desc")}</p>
              <Button asChild variant="outline" className="bg-transparent w-fit border-white text-white hover:bg-white hover:text-black">
                <a href="/products">{t("categories.items.baby.cta")}</a>
              </Button>
            </div>
          </motion.div>

          {/* Both Category */}
          <motion.div variants={fadeInUp} className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: "url('/assets/home/both.webp')" }}
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white"
              style={{ background: "linear-gradient(to bottom left, rgba(242, 197, 114, 0.5), rgba(87, 75, 166, 0.9))" }}>
              <h3 className="text-2xl font-bold mb-2">{t("categories.items.both.title")}</h3>
              <p className="mb-4 text-gray-100 font-medium">{t("categories.items.both.desc")}</p>
              <Button asChild variant="outline" className="bg-transparent w-fit border-white text-white hover:bg-white hover:text-black">
                <a href="/products">{t("categories.items.both.cta")}</a>
              </Button>
            </div>
          </motion.div>

          {/* Mother Category */}
          <motion.div variants={fadeInUp} className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: "url('/assets/home/mother.webp')" }}
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white"
              style={{ background: "linear-gradient(to bottom left, rgba(242, 197, 114, 0.5), rgba(87, 75, 166, 0.9))" }}>
              <h3 className="text-2xl font-bold mb-2">{t("categories.items.mother.title")}</h3>
              <p className="mb-4 text-gray-100 font-medium">{t("categories.items.mother.desc")}</p>
              <Button asChild variant="outline" className="bg-transparent w-fit border-white text-white hover:bg-white hover:text-black">
                <a href="/products">{t("categories.items.mother.cta")}</a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Functionnalities Section ("Faites-nous confiance") */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">{t("functionnalities.title")}</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t("functionnalities.description")}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="w-full"
        >
          <div className="relative h-[500px] w-full overflow-hidden shadow-xl bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${carouselImages[currentSlide]})` }}
              >
                <div
                  className="absolute inset-0 flex flex-col justify-end p-12 md:p-24 text-white text-right"
                  style={{ background: carouselGradients[currentSlide] }}
                >
                  <div className="container mx-auto">
                    <div className="max-w-2xl ml-auto">
                      <h3 className="text-4xl font-bold mb-4">{carouselItems[currentSlide]?.title}</h3>
                      <p className="text-xl leading-relaxed opacity-95">
                        {carouselItems[currentSlide]?.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 transition-all duration-300 rounded-sm ${currentSlide === index ? "w-12 bg-white" : "w-8 bg-white/50 hover:bg-white/80"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts products={featuredProducts} />

      {/* Offers Section ("Nos Offres") */}
      <section id="subscriptions" className="w-full">
        {/* Title Section (White Background) */}
        <div className="bg-white pt-20 pb-10 text-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-900">{t("offers.title")}</h2>
              <p className="text-gray-900 font-medium text-lg leading-relaxed">
                {t("offers.description")}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Cards Section (Image Background) */}
        <div
          className="w-full py-10 pb-20 relative bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/home/offers.jpg')" }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6"
            >
              {/* Offer 1: Essentiel */}
              <motion.div variants={fadeInUp} className="w-full md:w-1/4">
                <Card className="h-full border-none shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center pb-2">
                    <h3 className="text-2xl font-normal text-gray-900">{t("offers.items.essential.name")} <span className="block text-sm text-gray-500">{t("offers.items.essential.sub")}</span></h3>
                    <p className="text-gray-600 font-medium mt-2">{t("offers.items.essential.price")}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mt-4">
                      {(getList("offers.items.essential.features") as string[]).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                          <ToggleIcon className="w-8 h-5 text-yellow-400 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Offer 2: Prestige (Highlighted) */}
              <motion.div variants={fadeInUp} className="w-full md:w-1/3 z-10 md:-mt-4">
                <Card className="h-full border-none shadow-2xl bg-[#FCD34D] scale-105 transform">
                  <CardHeader className="text-center pb-2 pt-8">
                    <h3 className="text-4xl font-bold mb-2 text-gray-900">
                      {t("offers.items.prestige.name")}
                    </h3>
                    <p className="text-gray-800 font-normal text-xl opacity-90">{t("offers.items.prestige.price")}</p>
                  </CardHeader>
                  <CardContent className="pt-6 pb-8">
                    <ul className="space-y-3 mb-8 px-4">
                      {(getList("offers.items.prestige.features") as string[]).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-900">
                          <ToggleIcon className="w-8 h-5 text-indigo-600 shrink-0" />
                          <span className="text-sm font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="px-8">
                      <Button className="w-full bg-transparent border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-2 py-6 text-lg">
                        <Crown className="w-5 h-5" />
                        {t("offers.items.prestige.cta")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Offer 3: Privilege */}
              <motion.div variants={fadeInUp} className="w-full md:w-1/4">
                <Card className="h-full border-none shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center pb-2">
                    <h3 className="text-2xl font-normal text-gray-900">{t("offers.items.privilege.name")}</h3>
                    <p className="text-gray-600 font-medium mt-2">{t("offers.items.privilege.price")}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mt-4 mb-8">
                      {(getList("offers.items.privilege.features") as string[]).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                          <ToggleIcon className="w-8 h-5 text-yellow-400 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full border-gray-400 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                      <Crown className="w-4 h-4" />
                      {t("offers.items.privilege.cta")}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
import { HeroSlider } from '../components/home/HeroSlider';
import { Marquee } from '../components/common/Marquee';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { Newsletter } from '../components/common/Newsletter';

export const Home = () => {
    return (
        <main className="min-h-screen pt-20">
            <HeroSlider />
            <Marquee />
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Explore Nossas Delícias</h2>
                <CategoryGrid />
            </section>
            <Newsletter />
        </main>
    );
};
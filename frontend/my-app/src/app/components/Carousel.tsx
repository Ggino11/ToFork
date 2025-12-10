"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; 

const offerte = [
    { src: "/mollica.png", alt: "Mollica", link: "/ristoranti/mollica" },
    { src: "/panino.png", alt: "Mc Bun", link: "/ristoranti/m-bun" },
    { src: "/da_zero.png", alt: "Da Zero", link: "/ristoranti/da-zero" },
    { src: "/sushi1.png", alt: "Sushi", link: "/ristoranti/prova" },
];

const AUTOPLAY_MS = 5000;

export default function Carousel() {
    const [startIdx, setStartIdx] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 1024) {
                setVisibleCount(3);
            } else if (window.innerWidth >= 640) {
                setVisibleCount(2);
            } else {
                setVisibleCount(1);
            }
        }

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // scorrimento automatico 
    useEffect(() => {
        const interval = setInterval(() => {
            setStartIdx((prev) => (prev + 1) % offerte.length);
        }, AUTOPLAY_MS);
        return () => clearInterval(interval);
    }, []);

    const visibili = [];
    for (let i = 0; i < visibleCount; i++) {
        visibili.push(offerte[(startIdx + i) % offerte.length]);
    }

    const itemWidthClass = `w-[calc((100vw-4rem)/${visibleCount})] sm:w-[calc((100vw-5rem)/${visibleCount})]`;

    const prevSlide = () => {
        setStartIdx((prev) => (prev - 1 + offerte.length) % offerte.length);
    };

    const nextSlide = () => {
        setStartIdx((prev) => (prev + 1) % offerte.length);
    };

    return (
        <section>
            <h2 className="text-2xl font-semibold mb-6 text-black">Offerte Esclusive</h2>
            <div className="relative flex items-center justify-center gap-4">
                {/* Freccia sinistra */}
                <button
                    onClick={prevSlide}
                    aria-label="Offerta precedente"
                    className="left-0 z-10 rounded-full bg-black/50 text-white p-2 hover:bg-black"
                >
                    &#8592;
                </button>
                {/* Offerte visibili */}
                <div className="flex gap-4 overflow-hidden w-full max-w-[1200px] justify-center">
                    {visibili.map((off, idx) => (
                        <Link
                            key={idx}
                            href={off.link}
                            className={`${itemWidthClass} relative rounded-lg overflow-hidden flex-shrink-0 h-[250px] cursor-pointer transition hover:scale-105`}
                        >
                            <Image
                                src={off.src}
                                alt={off.alt}
                                width={400}
                                height={250}
                                className="object-cover w-full h-full"
                            />
                        </Link>
                    ))}
                </div>
                {/* Freccia destra */}
                <button
                    onClick={nextSlide}
                    aria-label="Offerta successiva"
                    className="right-0 z-10 rounded-full bg-black/50 text-white p-2 hover:bg-black"
                >
                    &#8594;
                </button>
            </div>
        </section>
    );
}

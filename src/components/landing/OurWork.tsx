import { motion } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

const galleryImages = [
  {
    src: '/sets images/classic-lashes.jpg',
    alt: 'Classic Lash Set',
    category: 'Classic',
  },
  {
    src: '/sets images/glamour-lashes.jpg',
    alt: 'Glamour Lash Set',
    category: 'Classic',
  },
  {
    src: '/sets images/volume-lashes.jpg',
    alt: 'Volume Lash Set',
    category: 'Volume',
  },
  {
    src: '/sets images/natural-volume-lashes.jpg',
    alt: 'Natural Volume Lash Set',
    category: 'Volume',
  },
  {
    src: '/sets images/hybrid-lashes.jpg',
    alt: 'Hybrid Lash Set',
    category: 'Hybrid',
  },
  {
    src: '/sets images/wispy-lashes.jpg',
    alt: 'Wispy Lash Set',
    category: 'Volume',
  },
  {
    src: '/sets images/cat-eye-lashes.jpg',
    alt: 'Cat Eye Lash Set',
    category: 'Hybrid',
  },
  {
    src: '/sets images/doll-eye-lashes.jpg',
    alt: 'Doll Eye Lash Set',
    category: 'Volume',
  },
];

export const OurWork = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-16 bg-background">
      <div className="container max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
            Portfolio
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-normal text-foreground mb-3">
            Our Work
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our stunning lash transformations and see the artistry that awaits you.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={`relative group cursor-pointer overflow-hidden rounded-lg ${
                index === 0 || index === 4
                  ? 'md:col-span-2 md:row-span-2'
                  : ''
              }`}
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-sans text-base font-medium mb-1 drop-shadow-lg">
                    {image.category}
                  </span>
                  <span className="text-white/90 text-xs">View Details</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </section>
  );
};

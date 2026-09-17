import { motion } from 'motion/react';
import { ContactHeading } from '../AnimatedHeadings';
import CommandContactForm from '../CommandContactForm';

interface ContactProps {
  sectionRevealVariants: any;
}

export default function Contact({ sectionRevealVariants }: ContactProps) {
  return (
    <motion.section 
      id="contact" 
      variants={sectionRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className="scroll-mt-24"
    >
      <ContactHeading 
        subtitle="Get in Touch"
        title="Contact Me"
      />
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-sm text-zinc-350 max-w-xl font-sans leading-relaxed text-left mt-2"
      >
        Have a project, role, or collaboration in mind? Send me a message below and I will get back to you as soon as possible.
      </motion.p>

      <div className="mt-8">
        <CommandContactForm />
      </div>
    </motion.section>
  );
}

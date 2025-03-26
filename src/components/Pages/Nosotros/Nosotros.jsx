import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Nosotros.css';

const Nosotros = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [refMision, inViewMision] = useInView();
  const [refObjetivo, inViewObjetivo] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    if (inViewMision) {
      controls.start('visible');
    }
  }, [controls, inViewMision]);

  useEffect(() => {
    if (inViewObjetivo) {
      controls.start('visible');
    }
  }, [controls, inViewObjetivo]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="nosotros-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">SOMOS WIT</h1>
            <p className="hero-subtitle">Innovación con más de 17 años de trabajo</p>
          </motion.div>
        </div>
      </div>

      {/* Descripción */}
      <motion.section 
        className="descripcion-section"
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.div className="container" variants={itemVariants}>
          <h2 className="section-title">Quiénes Somos</h2>
          <div className="section-content">
            <p>
              Somos una empresa de desarrollo de productos y soluciones tecnológicas para grandes, pequeñas y medianas empresas. 
              Entre nuestras funciones destaca la creación, diseño e implementación de herramientas para la solución de problemas 
              que permiten a nuestros clientes rentabilizar y optimizar sus procesos.
            </p>
            <p>
              Nuestra fortaleza se basa en el Desarrollo utilizando las TIC (Tecnologías de la información y la comunicación) 
              y NTIC (Nuevas Tecnologías de la información y la comunicación) como elementos centrales ampliando las oportunidades 
              de desarrollo profesional y asegurando la sustentabilidad financiera del negocio.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Misión y Objetivo */}
      <div className="mision-objetivo-container">
        {/* Misión */}
        <motion.section 
          className="mision-section"
          ref={refMision}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div className="card" variants={itemVariants}>
            <div className="card-header">
              <h3 className="card-title">Misión</h3>
              <div className="icon-container">
                <i className="fas fa-bullseye"></i>
              </div>
            </div>
            <div className="card-body">
              <p>
                Desarrollar soluciones tecnológicas innovadoras que le otorguen valor agregado y diferenciación en el mercado 
                a nuestros clientes, utilizando las NTIC como elementos centrales, juntos con ampliar las oportunidades de 
                desarrollo profesional y personal a los colaboradores y asegurar la sustentabilidad financiera del negocio.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Objetivo */}
        <motion.section 
          className="objetivo-section"
          ref={refObjetivo}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div className="card" variants={itemVariants}>
            <div className="card-header">
              <h3 className="card-title">Objetivo</h3>
              <div className="icon-container">
                <i className="fas fa-flag"></i>
              </div>
            </div>
            <div className="card-body">
              <p>
                Aportar al desarrollo global en torno al uso e implementación de las NTIC en el contexto social y empresarial, 
                apoyando la evolución humana hacia un mundo más interconectado, moderno y eficiente en el consumo de recursos. 
                Posicionarnos como referentes en el mundo del desarrollo e innovación tecnológica en América Latina.
              </p>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {/* Logo Section */}
      <motion.section 
        className="logo-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="logo-container">
  <div className="logo-circle">
    {/* Reemplazamos el texto por la imagen */}
    <img 
      src="src/assets/wit.png" 
      alt="Logo WIT" 
      className="logo-image"
    />
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="particle" 
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            animationDelay: `${Math.random() * 2}s`
          }}
        ></div>
      ))}
    </div>
  </div>
</div>
      </motion.section>
    </div>
  );
};

export default Nosotros;
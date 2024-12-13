import React, { useEffect } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

const EventLoader: React.FC = () => {
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    tl.to('.loader-ticket', {
      x: '200px',
      duration: 1,
      ease: 'power1.inOut',
    })
      .to('.loader-ticket', {
        rotate: '15deg',
        duration: 0.5,
        ease: 'power1.inOut',
      })
      .to('.loader-ticket', {
        rotate: '-15deg',
        duration: 0.5,
        ease: 'power1.inOut',
      })
      .to('.loader-ticket', { x: '0px', rotate: '0deg', duration: 1, ease: 'power1.inOut' });

    // Animate the QR code scaling in and out
    gsap.fromTo(
      '.loader-qr',
      { scale: 0.8 },
      { scale: 1.2, duration: 0.8, ease: 'power1.inOut', repeat: -1, yoyo: true }
    );

    // Animate dots pulsating
    gsap.to('.loader-dot', {
      opacity: 0.3,
      stagger: 0.2,
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
    });
  }, []);

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        {/* Ticket */}
        <div className="loader-ticket">
        <Image
              src="/goldTicket.png"
              width={180}
              height={180}
              alt="Profile"
            />
        </div>

        {/* QR Code */}
        <div className="loader-qr">
          <span role="img" aria-label="QR Code">
            {/* 📱 */}
            <Image
              src="/qr.png"
              width={220}
              height={220}
              alt="QR CODE"
            />
          </span>
        </div>

        {/* Pulsating Dots */}
        <div className="loader-dots">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      </div>

      <style jsx>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 2, 0.95);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .loader-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .loader-ticket {
          font-size: 2.5rem;
          color: #007bff;
        }
        .loader-qr {
          font-size: 2rem;
          color: #00c851;
        }
        .loader-dots {
          display: flex;
          gap: 10px;
        }
        .loader-dot {
          width: 10px;
          height: 10px;
          background-color: #007bff;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default EventLoader;

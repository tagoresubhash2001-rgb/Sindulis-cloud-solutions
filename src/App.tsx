import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection, PortalBottomDetails } from './components/HeroSection';
import { CardMatrixGrid } from './components/CardMatrixGrid';
import { BottomActionArea } from './components/BottomActionArea';
import { Footer } from './components/Footer';
import { PillarDetailModal } from './components/PillarDetailModal';
import { WaitlistModal } from './components/WaitlistModal';
import { LoginModal } from './components/LoginModal';
import { UtilityModal } from './components/UtilityModal';
import { Toast } from './components/Toast';

// EduLis Platform Components
import { EdulisDynamicIslandHeader } from './components/edulis/EdulisDynamicIslandHeader';
import { EdulisHome } from './components/edulis/EdulisHome';
import { EdulisAbout } from './components/edulis/EdulisAbout';
import { EdulisServices } from './components/edulis/EdulisServices';
import { EdulisContact } from './components/edulis/EdulisContact';
import { EdulisFooter } from './components/edulis/EdulisFooter';
import { EdulisEnrollModal } from './components/edulis/EdulisEnrollModal';
import { EdulisSocialDock } from './components/edulis/EdulisSocialDock';

// Sinfox Media Platform Components
import { SinfoxDynamicIslandHeader } from './components/sinfox/SinfoxDynamicIslandHeader';
import { SinfoxHome } from './components/sinfox/SinfoxHome';
import { SinfoxServices } from './components/sinfox/SinfoxServices';
import { SinfoxAbout } from './components/sinfox/SinfoxAbout';
import { SinfoxContact } from './components/sinfox/SinfoxContact';
import { SinfoxFooter } from './components/sinfox/SinfoxFooter';
import { SinfoxSocialDock } from './components/sinfox/SinfoxSocialDock';
import { SinfoxQuoteModal } from './components/sinfox/SinfoxQuoteModal';

// Tech Lis Enterprise Platform Components
import { TechlisDynamicIslandHeader } from './components/techlis/TechlisDynamicIslandHeader';
import { TechlisHome } from './components/techlis/TechlisHome';
import { TechlisAbout } from './components/techlis/TechlisAbout';
import { TechlisServices } from './components/techlis/TechlisServices';
import { TechlisContact } from './components/techlis/TechlisContact';
import { TechlisFooter } from './components/techlis/TechlisFooter';
import { TechlisSocialDock } from './components/techlis/TechlisSocialDock';
import { TechlisQuoteModal } from './components/techlis/TechlisQuoteModal';

import { ALL_ECOSYSTEM_CARDS } from './data/ecosystemData';
import { EcosystemCardData, ModalType, UserSession, AppView, EdulisPage, SinfoxPage, TechlisPage } from './types';

export default function App() {
  // Top-level View state: Defaulting to 'sinfox' for Sinfox Media Executive Platform
  const [appView, setAppView] = useState<AppView>('sindulis-portal');
  const [edulisPage, setEdulisPage] = useState<EdulisPage>('home');
  const [sinfoxPage, setSinfoxPage] = useState<SinfoxPage>('home');
  const [techlisPage, setTechlisPage] = useState<TechlisPage>('home');

  // Sindulis Portal States
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'coming-soon'>('all');
  const [modalState, setModalState] = useState<ModalType>(null);
  const [utilityModal, setUtilityModal] = useState<'privacy' | 'terms' | 'contact' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [session, setSession] = useState<UserSession>({
    isLoggedIn: false
  });

  const handleSelectCard = (card: EcosystemCardData) => {
    if (card.id === 'sinfoxmedia') {
      setAppView('sinfox');
      setSinfoxPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (card.id === 'edulis') {
      setAppView('edulis');
      setEdulisPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (card.id === 'techlis' || card.id === 'sindulis') {
      setAppView('techlis');
      setTechlisPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (card.category === 'active') {
      setModalState({ type: 'pillar-detail', card });
    } else {
      setModalState({ type: 'waitlist', card });
    }
  };

  const handleShowToast = (msg: string) => {
    setToastMessage(msg);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans selection:bg-[#0088FF]/20 selection:text-[#0B1299]">
      
      {/* ------------------------------------------------------------- */}
      {/* VIEW 1: SINFOX MEDIA ULTRA-LUXURY EXECUTIVE PLATFORM          */}
      {/* ------------------------------------------------------------- */}
      {appView === 'sinfox' ? (
        <div className="min-h-screen flex flex-col justify-between bg-white animate-fade-in">
          {/* Dynamic Island Header */}
          <SinfoxDynamicIslandHeader
            activePage={sinfoxPage}
            onPageChange={(page) => setSinfoxPage(page)}
            onSwitchView={(view) => setAppView(view)}
            onOpenQuoteModal={() => setModalState({ type: 'sinfox-quote' })}
          />

          {/* Active Sinfox Page */}
          <main className="flex-1">
            {sinfoxPage === 'home' && (
              <SinfoxHome
                onNavigate={(page) => setSinfoxPage(page)}
                onOpenQuoteModal={(serviceName) =>
                  setModalState({ type: 'sinfox-quote', defaultService: serviceName })
                }
              />
            )}

            {sinfoxPage === 'services' && (
              <SinfoxServices
                onNavigate={(page) => setSinfoxPage(page)}
                onOpenQuoteModal={(serviceName) =>
                  setModalState({ type: 'sinfox-quote', defaultService: serviceName })
                }
              />
            )}

            {sinfoxPage === 'about' && (
              <SinfoxAbout
                onNavigate={(page) => setSinfoxPage(page)}
                onOpenQuoteModal={(serviceName) =>
                  setModalState({ type: 'sinfox-quote', defaultService: serviceName })
                }
              />
            )}

            {sinfoxPage === 'contact' && (
              <SinfoxContact
                onNavigate={(page) => setSinfoxPage(page)}
                onOpenQuoteModal={(serviceName) =>
                  setModalState({ type: 'sinfox-quote', defaultService: serviceName })
                }
              />
            )}
          </main>

          {/* Editorial Sinfox Footer */}
          <SinfoxFooter
            onPageChange={(page) => {
              setSinfoxPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchView={(view) => setAppView(view)}
            onOpenQuoteModal={() => setModalState({ type: 'sinfox-quote' })}
          />

          {/* Sinfox Right-Side Social Dock */}
          <SinfoxSocialDock />
        </div>
      ) : appView === 'edulis' ? (
        /* ------------------------------------------------------------- */
        /* VIEW 2: EDULIS ACADEMY PLATFORM                               */
        /* ------------------------------------------------------------- */
        <div className="min-h-screen flex flex-col justify-between bg-slate-50 animate-fade-in">
          <EdulisDynamicIslandHeader
            activePage={edulisPage}
            onPageChange={(page) => setEdulisPage(page)}
            onSwitchView={(view) => setAppView(view)}
            onOpenEnrollModal={() => setModalState({ type: 'enroll' })}
          />

          <main className="flex-1">
            {edulisPage === 'home' && (
              <EdulisHome
                onNavigate={(page) => setEdulisPage(page)}
                onOpenEnrollModal={(programId, domainId) =>
                  setModalState({ type: 'enroll', programId, domainId })
                }
              />
            )}

            {edulisPage === 'about' && (
              <EdulisAbout
                onNavigate={(page) => setEdulisPage(page)}
                onOpenEnrollModal={() => setModalState({ type: 'enroll' })}
              />
            )}

            {edulisPage === 'services' && (
              <EdulisServices
                onOpenEnrollModal={(programId) =>
                  setModalState({ type: 'enroll', programId })
                }
              />
            )}

            {edulisPage === 'contact' && <EdulisContact />}
          </main>

          <EdulisFooter
            onPageChange={(page) => {
              setEdulisPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchView={(view) => setAppView(view)}
            onOpenEnrollModal={() => setModalState({ type: 'enroll' })}
          />

          <EdulisSocialDock />
        </div>
      ) : appView === 'techlis' ? (
        /* ------------------------------------------------------------- */
        /* VIEW 3: TECH LIS ENTERPRISE PLATFORM                          */
        /* ------------------------------------------------------------- */
        <div className="min-h-screen flex flex-col justify-between bg-white animate-fade-in">
          <TechlisDynamicIslandHeader
            activePage={techlisPage}
            onPageChange={(page) => setTechlisPage(page)}
            onSwitchView={(view) => setAppView(view)}
            onOpenQuoteModal={() => setModalState({ type: 'techlis-quote' })}
          />

          <main className="flex-1">
            {techlisPage === 'home' && (
              <TechlisHome
                onNavigate={(page) => setTechlisPage(page)}
                onOpenQuoteModal={(serviceName) =>
                  setModalState({ type: 'techlis-quote', defaultService: serviceName })
                }
              />
            )}

            {techlisPage === 'services' && (
              <TechlisServices
                onOpenQuoteModal={(serviceName) =>
                  setModalState({ type: 'techlis-quote', defaultService: serviceName })
                }
              />
            )}

            {techlisPage === 'about' && (
              <TechlisAbout
                onNavigate={(page) => setTechlisPage(page)}
                onOpenQuoteModal={(serviceName) =>
                  setModalState({ type: 'techlis-quote', defaultService: serviceName })
                }
              />
            )}

            {techlisPage === 'contact' && <TechlisContact />}
          </main>

          <TechlisFooter
            onPageChange={(page) => {
              setTechlisPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchView={(view) => setAppView(view)}
            onOpenQuoteModal={() => setModalState({ type: 'techlis-quote' })}
          />

          <TechlisSocialDock />
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* VIEW 4: SINDULIS CLOUD ECOSYSTEM PORTAL                       */
        /* ------------------------------------------------------------- */
        <div className="min-h-screen flex flex-col justify-between animate-fade-in">
          <Header
            onOpenLogin={() => setModalState({ type: 'login' })}
            isLoggedIn={session.isLoggedIn}
          />

          <main className="flex-1 flex flex-col justify-between">
            <div>
              <HeroSection
                onOpenLogin={() => setModalState({ type: 'login' })}
              />

              <CardMatrixGrid
                cards={ALL_ECOSYSTEM_CARDS}
                onSelectCard={handleSelectCard}
                activeTab={activeTab}
              />

              <PortalBottomDetails
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            <BottomActionArea
              onOpenLogin={() => setModalState({ type: 'login' })}
            />
          </main>

          <Footer
            onOpenPrivacy={() => setUtilityModal('privacy')}
            onOpenTerms={() => setUtilityModal('terms')}
            onOpenContact={() => setUtilityModal('contact')}
            onSwitchView={(view) => {
              if (view === 'techlis') setAppView('techlis');
              else if (view === 'sinfox') setAppView('sinfox');
              else if (view === 'edulis') setAppView('edulis');
            }}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* GLOBAL MODALS                                                 */}
      {/* ------------------------------------------------------------- */}
      {modalState?.type === 'pillar-detail' && (
        <PillarDetailModal
          card={modalState.card}
          onClose={() => setModalState(null)}
          onOpenLogin={() => setModalState({ type: 'login' })}
          onShowToast={handleShowToast}
        />
      )}

      {modalState?.type === 'waitlist' && (
        <WaitlistModal
          card={modalState.card}
          onClose={() => setModalState(null)}
          onShowToast={handleShowToast}
        />
      )}

      {modalState?.type === 'login' && (
        <LoginModal
          onClose={() => setModalState(null)}
          onLoginSuccess={(email: string) => {
            setSession({ isLoggedIn: true, email, name: email.split('@')[0] });
            handleShowToast(`Welcome back, ${email.split('@')[0]}!`);
          }}
        />
      )}

      {modalState?.type === 'enroll' && (
        <EdulisEnrollModal
          isOpen={true}
          onClose={() => setModalState(null)}
          defaultProgramId={modalState.programId}
          defaultDomainId={modalState.domainId}
        />
      )}

      {modalState?.type === 'sinfox-quote' && (
        <SinfoxQuoteModal
          isOpen={true}
          onClose={() => setModalState(null)}
          defaultService={modalState.defaultService}
        />
      )}

      {modalState?.type === 'techlis-quote' && (
        <TechlisQuoteModal
          isOpen={true}
          onClose={() => setModalState(null)}
          defaultService={modalState.defaultService}
        />
      )}

      {utilityModal && (
        <UtilityModal
          type={utilityModal}
          onClose={() => setUtilityModal(null)}
          onShowToast={handleShowToast}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

    </div>
  );
}

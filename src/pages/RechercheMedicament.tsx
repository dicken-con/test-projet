import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import RealMap from '../components/RealMap';
import Modal from '../components/Modal';
import { DAKAR_BOUNDS } from '../data/pharmaciesMap';
import { pharmaciesService } from '../services/pharmaciesService';
import {
  calculerItineraire,
  distanceHaversine,
  genererPositionAleatoireDakar,
} from '../services/routingService';
import { Coordonnees, ResultatRecherche, MoyenPaiement, PharmacieMap } from '../types';

type Etape = 'recherche' | 'chargement' | 'resultat' | 'introuvable';

const RechercheMedicament: React.FC = () => {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [medicament, setMedicament] = useState('');
  const [etape, setEtape] = useState<Etape>('recherche');
  const [userPosition, setUserPosition] = useState<Coordonnees | null>(null);
  const [resultat, setResultat] = useState<ResultatRecherche | null>(null);
  const [erreur, setErreur] = useState('');

  const [pharmacies, setPharmacies] = useState<PharmacieMap[]>([]);

  useEffect(() => {
    pharmaciesService.getAll().then(setPharmacies);
  }, []);

  const [isUrgenceOpen, setIsUrgenceOpen] = useState(false);
  const [messageUrgence, setMessageUrgence] = useState('');
  const [urgenceEnvoyee, setUrgenceEnvoyee] = useState(false);

  const [isPaiementOpen, setIsPaiementOpen] = useState(false);
  const [moyenPaiement, setMoyenPaiement] = useState<MoyenPaiement | null>(null);
  const [paiementConfirme, setPaiementConfirme] = useState(false);

  const handleRecherche = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicament.trim()) return;

    setErreur('');
    setEtape('chargement');

    const position = genererPositionAleatoireDakar(DAKAR_BOUNDS);
    setUserPosition(position);

    const terme = medicament.trim().toLowerCase();
    const disposantDuMedicament = pharmacies.filter((p) =>
      p.medicamentsDisponibles.some((m) => m.toLowerCase().includes(terme))
    );

    if (disposantDuMedicament.length === 0) {
      setEtape('introuvable');
      return;
    }

    const pharmacieLaPlusProche = disposantDuMedicament
      .map((pharmacie) => ({ pharmacie, distanceApprox: distanceHaversine(position, pharmacie.position) }))
      .sort((a, b) => a.distanceApprox - b.distanceApprox)[0].pharmacie;

    try {
      const itineraire = await calculerItineraire(position, pharmacieLaPlusProche.position);
      setResultat({ pharmacie: pharmacieLaPlusProche, itineraire });
      setEtape('resultat');
    } catch (err) {
      setErreur("Impossible de calculer l'itinéraire routier pour le moment. Réessayez.");
      setEtape('recherche');
    }
  };

  const reinitialiser = () => {
    setEtape('recherche');
    setResultat(null);
    setUserPosition(null);
    setUrgenceEnvoyee(false);
    setPaiementConfirme(false);
    setMoyenPaiement(null);
  };

  const handleEnvoyerUrgence = (e: React.FormEvent) => {
    e.preventDefault();
    setUrgenceEnvoyee(true);
  };

  const handlePartagerYango = async () => {
    if (!userPosition || !resultat) return;

    const { lat: latDepart, lng: lngDepart } = userPosition;
    const { lat: latArrivee, lng: lngArrivee } = resultat.pharmacie.position;

    const urlItineraire = `https://yandex.com/maps/?rtext=${latDepart},${lngDepart}~${latArrivee},${lngArrivee}&rtt=auto`;
    const texteMessage = `Itinéraire vers ${resultat.pharmacie.nom} pour récupérer ${medicament} (${resultat.itineraire.distanceKm.toFixed(1)} km, ${Math.max(1, Math.round(resultat.itineraire.dureeMinutes))} min)`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Itinéraire PharmaLink',
          text: texteMessage,
          url: urlItineraire,
        });
      } catch {
        // L'utilisateur a annulé le partage, rien à faire
      }
    } else {
      window.open(urlItineraire, '_blank');
    }
  };

  const genererValeurQrCode = (moyen: MoyenPaiement): string => {
    const reference = `PL-${Date.now().toString().slice(-8)}`;
    return JSON.stringify({
      service: moyen === 'wave' ? 'Wave' : 'Orange Money',
      pharmacie: resultat?.pharmacie.nom,
      medicament,
      reference,
    });
  };

  const handleConfirmerPaiement = () => {
    setPaiementConfirme(true);
    setTimeout(() => {
      setIsPaiementOpen(false);
      setPaiementConfirme(false);
      setMoyenPaiement(null);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      <RealMap
        pharmacies={pharmacies}
        userPosition={userPosition}
        selectedPharmacieId={resultat?.pharmacie.id || null}
        tracé={resultat?.itineraire.tracé}
        className="absolute inset-0 w-full h-full z-0"
      />

      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-[1000] bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-50"
      >
        ←
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-[1000] px-4 pb-4 sm:px-0 sm:flex sm:justify-center">
        <div className="w-full sm:max-w-md bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:mb-4 max-h-[75vh] overflow-y-auto">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 sm:hidden"></div>

          {etape === 'recherche' && (
            <form onSubmit={handleRecherche} className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                Rechercher un médicament
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Nous vérifions la disponibilité dans chaque pharmacie et calculons le trajet le plus rapide.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <input
                type="text"
                placeholder="Médicament recherché (ex. Paracétamol 500mg)"
                value={medicament}
                onChange={(e) => setMedicament(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />

              {erreur && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{erreur}</p>}

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Trouver une pharmacie
              </button>
            </form>
          )}

          {etape === 'chargement' && (
            <div className="py-8 text-center">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recherche dans les bases de données des pharmacies et calcul de l'itinéraire...
              </p>
            </div>
          )}

          {etape === 'introuvable' && (
            <div className="py-6 text-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Aucune pharmacie de notre réseau ne dispose de « {medicament} » actuellement.
              </p>
              <button
                onClick={reinitialiser}
                className="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline"
              >
                Faire une nouvelle recherche
              </button>
            </div>
          )}

          {etape === 'resultat' && resultat && (
            <div>
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 mb-2">
                Pharmacie la plus proche avec le stock disponible
              </span>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{resultat.pharmacie.nom}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{resultat.pharmacie.adresse}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-primary-700 dark:text-primary-400">
                    {resultat.itineraire.distanceKm.toFixed(1)} km
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Distance réelle</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-primary-700 dark:text-primary-400">
                    {Math.max(1, Math.round(resultat.itineraire.dureeMinutes))} min
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Temps de trajet</p>
                </div>
              </div>

              <button
                onClick={() => setIsUrgenceOpen(true)}
                className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium py-2.5 rounded-xl transition-colors text-sm mb-2"
              >
                Envoyer une demande d'urgence
              </button>

              <button
                onClick={handlePartagerYango}
                className="w-full bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium py-2.5 rounded-xl transition-colors text-sm mb-2 flex items-center justify-center gap-2"
              >
                <span>🚕</span> Partager l'itinéraire sur Yango
              </button>

              <button
                onClick={reinitialiser}
                className="w-full text-xs text-gray-400 dark:text-gray-500 hover:underline text-center py-1"
              >
                Nouvelle recherche
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isUrgenceOpen} onClose={() => setIsUrgenceOpen(false)} title="Demande de préparation en urgence">
        {!urgenceEnvoyee ? (
          <form onSubmit={handleEnvoyerUrgence} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Votre demande sera envoyée à <strong>{resultat?.pharmacie.nom}</strong> pour préparer{' '}
              <strong>{medicament}</strong> avant votre arrivée (environ{' '}
              {Math.max(1, Math.round(resultat?.itineraire.dureeMinutes || 0))} min).
            </p>
            <textarea
              value={messageUrgence}
              onChange={(e) => setMessageUrgence(e.target.value)}
              rows={3}
              placeholder="Message complémentaire (optionnel)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <button
              type="submit"
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Envoyer la demande
            </button>
          </form>
        ) : (
          <div className="text-center py-2">
            <p className="text-primary-600 dark:text-primary-400 font-medium mb-1">
              ✓ Demande envoyée à {resultat?.pharmacie.nom}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              La pharmacie prépare votre médicament. Vous pouvez régler dès maintenant pour gagner du temps à votre arrivée.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsUrgenceOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Payer sur place
              </button>
              <button
                onClick={() => {
                  setIsUrgenceOpen(false);
                  setIsPaiementOpen(true);
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                Envoyer l'argent en avance
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isPaiementOpen}
        onClose={() => {
          setIsPaiementOpen(false);
          setMoyenPaiement(null);
        }}
        title="Paiement anticipé"
      >
        {!paiementConfirme ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Choisissez votre moyen de paiement pour régler <strong>{medicament}</strong> avant votre arrivée.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMoyenPaiement('wave')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  moyenPaiement === 'wave'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  W
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Wave</span>
              </button>

              <button
                type="button"
                onClick={() => setMoyenPaiement('orange_money')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  moyenPaiement === 'orange_money'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  OM
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Orange Money</span>
              </button>
            </div>

            {moyenPaiement && (
              <div className="flex flex-col items-center gap-3 pt-2 animate-fadeIn">
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Scannez ce QR code avec l'application {moyenPaiement === 'wave' ? 'Wave' : 'Orange Money'} pour confirmer le paiement
                </p>

                <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-200">
                  <QRCodeSVG
                    value={genererValeurQrCode(moyenPaiement)}
                    size={160}
                    fgColor={moyenPaiement === 'wave' ? '#1d4ed8' : '#c2410c'}
                    bgColor="#ffffff"
                    level="M"
                  />
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center">
                  Simulation à des fins de démonstration académique — aucune transaction réelle n'est effectuée.
                </p>

                <button
                  type="button"
                  onClick={handleConfirmerPaiement}
                  className="w-full py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  J'ai scanné, confirmer le paiement
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-primary-600 dark:text-primary-400 font-medium">✓ Paiement confirmé</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Présentez-vous à {resultat?.pharmacie.nom}, votre médicament sera prêt et déjà réglé.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RechercheMedicament;
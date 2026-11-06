import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin, Navigation, Compass, Car, Train, Plane, Bus,
  ExternalLink, Phone, ShieldAlert, Check, Copy, Share2
} from 'lucide-react';

const MIOT_COORDS = { lat: 13.0266079, lng: 80.1761188 };
const MIOT_DESTINATION = encodeURIComponent('MIOT International, 4/112, Mount Poonamallee Road, Manapakkam, Chennai, Tamil Nadu 600089');

const TRANSIT_HUBS = [
  {
    id: 'airport',
    name: 'Chennai International Airport (MAA)',
    distance: '7.8 km',
    time: '~15 mins',
    origin: 'Chennai International Airport, Meenambakkam, Chennai',
    icon: Plane,
    routeInfo: 'Via Grand Southern Trunk Rd & Mount Poonamallee Rd'
  },
  {
    id: 'metro',
    name: 'Guindy Metro & Railway Station',
    distance: '5.4 km',
    time: '~12 mins',
    origin: 'Guindy Metro Station, Chennai',
    icon: Train,
    routeInfo: 'Via Butt Road & Kathipara Flyover'
  },
  {
    id: 'central',
    name: 'Puratchi Thalaivar Dr. MGR Central (Chennai Central)',
    distance: '15.2 km',
    time: '~35 mins',
    origin: 'Chennai Central Railway Station, Chennai',
    icon: Train,
    routeInfo: 'Via Poonamallee High Rd & Guindy'
  },
  {
    id: 'cmbt',
    name: 'CMBT Koyambedu Bus Terminus',
    distance: '11.5 km',
    time: '~25 mins',
    origin: 'CMBT Bus Terminus, Koyambedu, Chennai',
    icon: Bus,
    routeInfo: 'Via 100 Feet Road / Inner Ring Rd'
  },
  {
    id: 'tambaram',
    name: 'Tambaram Railway Station',
    distance: '14.1 km',
    time: '~28 mins',
    origin: 'Tambaram Railway Station, Chennai',
    icon: Car,
    routeInfo: 'Via Grand Southern Trunk (GST) Road'
  }
];

export default function HospitalMapDirections({ className = '', showCard = true }) {
  const { t } = useTranslation();
  const [selectedHub, setSelectedHub] = useState(TRANSIT_HUBS[0]);
  const [locatingUser, setLocatingUser] = useState(false);
  const [copied, setCopied] = useState(false);

  // Navigate using user GPS
  const handleNavigateFromCurrentLocation = () => {
    if (!navigator.geolocation) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${MIOT_DESTINATION}`, '_blank');
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocatingUser(false);
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${MIOT_DESTINATION}&travelmode=driving`;
        window.open(url, '_blank');
      },
      (err) => {
        setLocatingUser(false);
        console.warn('Geolocation failed or denied:', err);
        // Fallback to direct navigation without origin
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${MIOT_DESTINATION}&travelmode=driving`, '_blank');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleOpenHubDirections = (hub) => {
    setSelectedHub(hub);
    const originParam = encodeURIComponent(hub.origin);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${MIOT_DESTINATION}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('MIOT International, 4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089, Tamil Nadu, India');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Embed URL centered on MIOT International
  const embedMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.1423851508215!2d80.17611887588325!3d13.026607913670966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5260b64d1f5ea1%3A0xe54625b1b46dae85!2sMIOT%20International!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin`;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Direction & Location Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <MapPin size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-wider">
                  {t('Hospital Location & Turn-by-Turn Navigation')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  ★ 4.6 (6,900+ {t('Reviews')})
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                MIOT International, Chennai
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089, Tamil Nadu, India
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleNavigateFromCurrentLocation}
              disabled={locatingUser}
              className="flex-1 sm:flex-none px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Compass size={16} className={locatingUser ? 'animate-spin' : ''} />
              <span>{locatingUser ? t('Locating GPS...') : t('Directions from My Location')} ↗</span>
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${MIOT_DESTINATION}&travelmode=driving`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ExternalLink size={15} />
              <span>{t('Open Google Maps')}</span>
            </a>

            <button
              onClick={handleCopyAddress}
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title={t('Copy Address')}
            >
              {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? t('Copied!') : t('Copy')}</span>
            </button>
          </div>
        </div>

        {/* Transit Hubs Quick Routes */}
        <div className="pt-6">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-3">
            {t('Popular Travel Routes & Distance to MIOT:')}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TRANSIT_HUBS.map((hub) => {
              const IconComp = hub.icon;
              const isSelected = selectedHub.id === hub.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => handleOpenHubDirections(hub)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-blue-200 hover:shadow-xs'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <IconComp size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate block">
                        {t(hub.name)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-black text-blue-700">{hub.distance}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold text-emerald-700">{hub.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {hub.routeInfo}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Embedded Live Google Map with Full Responsive View */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white">
        <div className="bg-slate-900 text-white p-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-sm font-black tracking-tight">{t('Interactive Map of MIOT Hospital')}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 text-xs">
            <span>📍 13.0266° N, 80.1761° E</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline text-amber-300">24/7 {t('Emergency Gate 1 Access')}</span>
          </div>
        </div>

        <div className="relative w-full h-80 sm:h-96 bg-slate-100">
          <iframe
            title="MIOT International Hospital Live Map"
            src={embedMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />

          {/* Floating Emergency Gate Direction Tag */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200 max-w-sm text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-black text-red-700">
              <ShieldAlert size={14} />
              <span>{t('Emergency & Trauma Entrance:')}</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-snug">
              {t('Located at Gate 1 on Mount Poonamallee Road with dedicated 24-hour ambulance & drive-in patient ramp.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

# Método GIME — Simulador Electoral

Simulador educativo del método biproporcional GIME (Grupo de Investigación en Métodos Electorales) para las elecciones generales de España.

Desarrollado por Victoriano Ramírez González, Universidad de Granada.

## Enlaces

- **Web:** https://sistemaelectoral.victoriano.me / https://gime.victoriano.me
- **Repo:** https://github.com/victoriano/sistemaelectoral

## Datos electorales

Datos oficiales de votos por partido y circunscripción descargados del **Ministerio del Interior**.

**Fuente:** https://infoelectoral.interior.gob.es/es/elecciones-celebradas/area-de-descargas/

Formato: ficheros `.DAT` (ancho fijo) dentro de ZIPs. Se parsean los ficheros 03 (partidos) y 08 (votos por provincia).

### Elecciones incluidas

| Año | Archivo | Provincias | Escaños | Fuente |
|-----|---------|------------|---------|--------|
| 2027* | `elections2027.ts` | 52 | 350 | Proyección basada en encuestas Feb 2026 |
| 2023 | `elections2023.ts` | 52 | 350 | Ministerio del Interior |
| 2019-N | `elections2019N.ts` | 52 | 350 | Ministerio del Interior |
| 2019-A | `elections2019A.ts` | 52 | 350 | Ministerio del Interior |
| 2016 | `elections2016.ts` | 52 | 350 | Ministerio del Interior |
| 2015 | `elections2015.ts` | 52 | 350 | Ministerio del Interior |
| 2011 | `elections2011.ts` | 52 | 350 | Ministerio del Interior |
| 2008 | `elections2008.ts` | 52 | 350 | Ministerio del Interior |
| 2004 | `elections2004.ts` | 52 | 350 | Ministerio del Interior |
| 2000 | `elections2000.ts` | 52 | 350 | Ministerio del Interior |
| 1996 | `elections1996.ts` | 52 | 350 | Ministerio del Interior |
| 1993 | `elections1993.ts` | 52 | 350 | Ministerio del Interior |

### Normalización de partidos

Los nombres de las candidaturas varían por circunscripción (federaciones regionales). Se normalizan a siglas estándar:
- PP ← P.P., PP-PAR, PP-EU, PPdeG...
- PSOE ← PSC-PSOE, PSdeG-PSOE, PSOE-A, PSE-EE, PSN-PSOE...
- IU ← IULV-CA, IU-CM, EB-IU, ICV-EUIA...
- UP ← PODEMOS-IU-EQUO, En Comú Podem, ECP...

### URL de descarga

```
https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02{YYYY}{MM}_TOTA.zip
```

Ejemplo: `02202307_TOTA.zip` → Elecciones Generales julio 2023

## Recursos externos

- **Identidad visual UGR:** https://secretariageneral.ugr.es/informacion/servicios/identidad-visual/descarga
- **Electocracia (encuestas electorales):** https://electocracia.com/
- **Datos electorales oficiales:** https://infoelectoral.interior.gob.es/
- **R package infoelectoral:** https://github.com/rOpenSpain/infoelectoral

## Stack

- Next.js 14 + React 18 + TypeScript
- Tailwind CSS + DaisyUI
- Recharts
- Vercel (deploy)

# Método GIME — Simulador Electoral

Simulador educativo del método biproporcional GIME (Grupo de Investigación en Métodos Electorales) para las elecciones generales de España.

Desarrollado por Victoriano Ramírez González, Universidad de Granada.

## Methodology / Sources

El simulador toma como referencia la propuesta GIME de **Victoriano Ramírez González (Universidad de Granada)** para aplicar un reparto biproporcional al Congreso de los Diputados.

Fuentes principales:

- Blog: https://1voto1asiento.blogspot.com/2010/05/el-sistema-biproporcional-segun-el.html
- Dialnet (autor): https://dialnet.unirioja.es/servlet/autor?codigo=161869
- Artículo en Extoikos: https://www.extoikos.es/n6/pdf/5.pdf

### Umbral electoral

- El umbral se aplica **por circunscripción** (igual que el sistema actual).
- Un partido que supere el umbral en **al menos una circunscripción** participa en el reparto nacional.
- Los partidos que no lo superan en ninguna circunscripción quedan fuera.
- Esto protege a los partidos regionalistas (PNV, ERC, Bildu, Junts, BNG…): superan el umbral en sus provincias y participan en el reparto nacional.

---

## Cómo funcionan los métodos

### D'Hondt (sistema actual español)

**La idea:** cada provincia reparte sus escaños de forma independiente. Lo que pase en otra provincia no importa.

**Ejemplo intuitivo:** imagina que una provincia tiene 5 escaños y tres partidos. Se hace una "subasta" donde cada partido puja con sus votos divididos entre 1, 2, 3… y los 5 escaños van a las 5 pujas más altas.

**Pseudocódigo:**

```
PARA CADA provincia:
    total_votos_provincia = sumar votos de todos los partidos
    
    # Filtrar partidos que no llegan al 3% en esta provincia
    partidos_válidos = partidos con (votos / total_votos_provincia) >= 3%
    
    # Repartir escaños uno a uno
    REPETIR (nº de escaños de la provincia) VECES:
        PARA CADA partido válido:
            cociente = votos_partido / (escaños_ya_ganados + 1)
        
        Dar el escaño al partido con mayor cociente

# El resultado nacional es simplemente sumar los escaños de cada provincia
```

**Problema:** Un partido con 1 millón de votos repartidos por toda España puede no conseguir ningún escaño (no le llega en ninguna provincia), mientras que otro con 200.000 votos concentrados en una provincia sí lo consigue.

---

### Método Biproporcional (GIME)

**La idea:** primero se decide cuántos escaños merece cada partido a nivel nacional (proporcional a sus votos totales). Después se distribuyen esos escaños entre las provincias, respetando a la vez que cada provincia mantenga su número de escaños.

**Analogía:** es como cuadrar una tabla de doble entrada. Las filas son las provincias (cada una con un total fijo de escaños) y las columnas son los partidos (cada uno con un total fijo de escaños nacionales). Hay que rellenar la tabla de modo que ambos totales cuadren.

**Pseudocódigo:**

```
# ── ETAPA 1: ¿Cuántos escaños merece cada partido? ──

# Filtro: un partido participa si supera el 3% en AL MENOS una provincia
partidos_cualificados = []
PARA CADA provincia:
    PARA CADA partido:
        SI votos_partido / total_votos_provincia >= 3%:
            añadir partido a partidos_cualificados

# Sumar todos los votos nacionales de los partidos cualificados
# y repartir los 350 escaños con D'Hondt nacional
escaños_por_partido = D'Hondt(votos_nacionales, 350 escaños)

# Ejemplo resultado: PP=120, PSOE=115, VOX=46, SUMAR=45, ERC=7, ...


# ── ETAPA 2: ¿En qué provincias se colocan esos escaños? ──

# Cada partido tiene un "peso" (multiplicador) que empieza en 1
multiplicador_partido = {partido: 1.0 para cada partido}

REPETIR hasta que todo cuadre:

    # Para cada provincia, repartir SUS escaños entre los partidos
    # usando D'Hondt, pero con votos ajustados por el multiplicador
    PARA CADA provincia:
        votos_ajustados = votos × multiplicador_partido
        asignar_escaños_provincia = D'Hondt(votos_ajustados, escaños_provincia)

    # Comprobar: ¿cada partido tiene los escaños que le tocan?
    PARA CADA partido:
        escaños_actuales = sumar escaños en todas las provincias
        escaños_objetivo = los de la Etapa 1
        
        SI escaños_actuales ≠ escaños_objetivo:
            # Ajustar: si tiene pocos, subir su peso; si tiene muchos, bajarlo
            multiplicador_partido *= escaños_objetivo / escaños_actuales

# Converge en ~7 iteraciones
```

**¿Por qué funciona?** Los multiplicadores actúan como "pesos" que corrigen las distorsiones. Si un partido tiene demasiados escaños, su multiplicador baja y en la siguiente ronda gana menos escaños en las provincias. Si tiene pocos, su multiplicador sube y compite mejor. Es como ajustar el volumen de cada partido hasta que todos suenen a la intensidad correcta.

**Resultado:** cada provincia mantiene exactamente sus escaños (representación territorial), y cada partido tiene exactamente los escaños que le corresponden por sus votos nacionales (proporcionalidad). Ambas cosas a la vez.

---

### ¿Qué cambia en la práctica?

| | D'Hondt actual | Biproporcional |
|---|---|---|
| **Votos perdidos** | ~1.2M (5.7%) | ~0.9M (4.4%) |
| **Proporcionalidad** | Gallagher ~5-6 | Gallagher ~1-2 |
| **Partidos pequeños nacionales** | Infrarepresentados | Representación justa |
| **Partidos regionalistas** | Sobrerrepresentados | Representación justa |
| **Representación territorial** | ✅ Sí | ✅ Sí (mismas provincias) |

*Datos basados en elecciones 2023.*

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

## Deploy

El repositorio está conectado a Vercel (cuenta personal de Victoriano) con **auto-deploy desde GitHub**.

- **Push a `main`** → deploy automático a producción
- **URLs:** https://sistemaelectoral.victoriano.me / https://gime.victoriano.me
- **No se necesita `vercel` CLI ni tokens** — el deploy se dispara al hacer `git push`

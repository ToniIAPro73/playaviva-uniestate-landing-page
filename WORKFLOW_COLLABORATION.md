# 🤝 WORKFLOW COLABORATIVO - SESSION 2

**Establecido**: Diciembre 19, 2025 - 06:16 AM CET
**Rama IA**: `perplexity/feat` (anteriormente `session-2/azure-bay-rebranding`)
**Flujo**: Paralelo con validación y merge centralizado

---

## 📋 ARQUITECTURA DEL WORKFLOW

```
┌─────────────────────────────────────────────────────────────┐
│                   TU MÁQUINA LOCAL                          │
│                    (Branch: development)                    │
│                                                             │
│  ✅ Testing local                                          │
│  ✅ Validación UX/UI                                       │
│  ✅ QA funcional                                           │
│  ✅ Aprobación final                                       │
└─────────────────────────────────────────────────────────────┘
                          ⬆️ PULL REQUEST
                    (yo promoeveré cambios)
┌─────────────────────────────────────────────────────────────┐
│              PERPLEXITY BRANCH (Esta rama)                 │
│         (perplexity/feat - IA Feature Branch)              │
│                                                             │
│  🔨 Implementación de cambios                              │
│  📝 Find & Replace operations                              │
│  🖼️ Image integration                                       │
│  📊 Data updates                                           │
└─────────────────────────────────────────────────────────────┘
                          ⬇️ MERGE (aprobado por ti)
┌─────────────────────────────────────────────────────────────┐
│            BRANCHES FINALES (Sincronizadas)                │
│                                                             │
│  📌 main (producción estable)                              │
│  🔵 preview (staging/demo)                                 │
│  🟢 production (live)                                       │
│  ⭐ perplexity/feat (IA Feature)                            │
│  🧪 development (testing personal)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧑‍💻 MIS RESPONSABILIDADES (En perplexity/feat)

### ✅ Haré:

1. **Análisis e Implementación**
   - [ ] Ejecutar Find & Replace operaciones
   - [ ] Actualizar precios y datos
   - [ ] Integrar imágenes Midjourney
   - [ ] Actualizar meta tags
   - [ ] Genericizar FAQs

2. **Commit y Documentación**
   - [ ] Commits atómicos con mensajes claros
   - [ ] Documentar cada cambio
   - [ ] Mantener histórico detallado
   - [ ] Crear PRs descriptivos

3. **Calidad de Código**
   - [ ] TypeScript type-safe
   - [ ] Sin errores de sintaxis
   - [ ] Linting compliant
   - [ ] Cambios mínimos (no refactoring)

4. **Validación Básica**
   - [ ] Verificar que el código compile
   - [ ] Chequear tipos TypeScript
   - [ ] Validar estructura JSON
   - [ ] Confirmar imports están OK

### ❌ NO haré:

- ❌ Push a otras ramas (solo trabajar en perplexity/feat)
- ❌ Desplegar a Vercel
- ❌ Tomar decisiones de merge
- ❌ Testing en ambiente de producción
- ❌ Merge a main/preview/production/development

---

## 🧑‍💼 TUS RESPONSABILIDADES (Rama development)

### ✅ Harás:

1. **Testing Local**
   - [ ] `npm run dev` y validar localmente
   - [ ] Probar UX/UI completo
   - [ ] Verificar funcionalidad de forms
   - [ ] Testing responsive (mobile/tablet/desktop)

2. **Validación Funcional**
   - [ ] Confirmar que todo se ve correcto
   - [ ] Validar que no hay broken links
   - [ ] Probar HubSpot integration
   - [ ] Verificar que ALTCHA funciona

3. **Decisión de Merge**
   - [ ] Dar visto bueno (LGTM)
   - [ ] Aprobar calidad
   - [ ] Confirmar alineación con goal

4. **Merge Centralizado** (usar `./scripts/promote.ps1`)
   - [ ] Pull cambios de perplexity/feat a development
   - [ ] Resolver conflictos si existen
   - [ ] Ejecutar script: `./scripts/promote.ps1`
   - [ ] Script sincroniza: development → main → preview → production + perplexity/feat
   - [ ] Todas las ramas alineadas automáticamente ✅

---

## 🔄 FLUJO DE TRABAJO PASO A PASO

### CICLO DE CADA CAMBIO

#### PASO 1: Yo desarrollo en perplexity/feat
```bash
# Estoy en esta rama
git branch
# perplexity/feat ← aquí estoy

# Hago cambios

# Commit atómico
git add app/page.tsx
```

#### PASO 2: Yo creo PR a tu development
```bash
# Crear PR (por GitHub UI o CLI)
gh pr create \
  --base development \
  --head perplexity/feat \
  --body "Changes implemented:
  - Replaced project name
  - Updated location references
  - Modified pricing
  
  Ready for testing in your development branch."
```

#### PASO 3: Tú pruebas en development
```bash
# En TU máquina
git checkout development
git pull origin development

# Traes mis cambios (merge o PR merge)
git merge origin/perplexity/feat

# Pruebas localmente
npm run dev
# → Verificas en http://localhost:3000
# → Pruebas formularios, responsivo, etc.
```

#### PASO 4: Tú das visto bueno
```bash
# Si todo está OK:
# 1. Comentas en PR: "LGTM ✅ Ready to merge"
# 2. O me avisas directamente: "Aprobado para merge"
```

#### PASO 5: Tú sincronizas todas las ramas (AUTOMÁTICO)
```bash
# En TU máquina, en development
# Ejecuta el script que sincroniza TODAS las ramas:

.\scripts\promote.ps1

# El script hace automáticamente:
# ✅ development → main
# ✅ main → preview
# ✅ preview → production
# ✅ main ↔ perplexity/feat (sincronización bidireccional)
# ✅ Rebase final para evitar desfases
```

#### PASO 6: Confirmación
```
✅ development: contiene todos los cambios
✅ main: sincronizado con development
✅ preview: sincronizado con main
✅ production: sincronizado con main
✅ perplexity/feat: sincronizado con main
```

---

## 📌 ESTADO DE RAMAS EN CUALQUIER MOMENTO

```
main
├─ development (TÚ trabajas aquí después de mi PR)
│  └─ Contiene todos mis cambios probados
├─ preview (deploy automático - staging)
│  └─ Espejo de main
├─ production (deploy automático - live)
│  └─ Espejo de main
└─ perplexity/feat (MI rama de trabajo - IA)
   └─ Sincronizado con main después de tus merges
```

---

## ⏱️ CICLO DE CAMBIOS - TIMELINE

### Batch 1: Naming & Location (Ejemplo)

```
⏱️ T+0min: Yo comienzo en perplexity/feat
  └─ Actualizar ubicación

⏱️ T+15min: Creo PR a development
  └─ PR Description: Detallado
  └─ Estado: "Ready for review"

⏱️ T+30min: Tú recibiste notificación
  └─ git checkout development
  └─ Traes mis cambios (merge PR)
  └─ npm run dev en local
  └─ Pruebas: Hero, titles, FAQs

⏱️ T+45min: Tú das visto bueno
  └─ Comentario en PR: "LGTM ✅"
  └─ O mensaje directo: "Aprobado"

⏱️ T+50min: Tú sincronizas todas las ramas (SCRIPT AUTOMÁTICO)
  └─ .\scripts\promote.ps1
  └─ development → main → preview → production
  └─ perplexity/feat sincronizado
  └─ Todas alineadas ✅

⏱️ T+55min: Siguiente batch
  └─ Yo continúo en perplexity/feat
  └─ Nuevos cambios (precios, imágenes, etc.)
  └─ Repito ciclo
```

---

## 🎯 VENTAJAS DE ESTE WORKFLOW

✅ **Separación clara**
- Tú controlas testing y decisiones
- Yo implemento con libertad
- Cambios no van a producción sin tu OK

✅ **Trazabilidad**
- Histórico completo en Git
- Todos los cambios documentados
- PRs muestran qué cambió

✅ **Rapidez + Automatización**
- Script `promote.ps1` sincroniza TODO automáticamente
- No necesitas hacer merges manuales
- Paralelo mientras pruebas

✅ **Control de calidad**
- Testing local antes de merge
- Validación en ambiente real
- Sincronización garantizada

✅ **Profesionalismo**
- Proceso documentado
- Fácil de onboard a terceros
- Portfolio-ready workflow

---

## ⚠️ PUNTOS CRÍTICOS

### 1. **Siempre desde development**
```bash
# ✅ Correcto: Tú traes cambios a development
git checkout development
git pull origin development

# ❌ Incorrecto: Yo no hago push a main/preview/production
git push origin main  # ← NO, nunca
```

### 2. **Merge centralizado SOLO por ti**
```bash
# ✅ Solo tú (usando el script):
.\scripts\promote.ps1

# ❌ Yo no:
git checkout main && git merge perplexity/feat  # ← NO
```

### 3. **PRs como comunicación**
```bash
# ✅ Cada batch de cambios = 1 PR
gh pr create --base development --head perplexity/feat

# ❌ Muchos commits sin PR
# Sin contexto de qué cambió y por qué
```

### 4. **El script lo hace TODO**
```bash
# ✅ Una línea sincroniza todas las ramas:
.\scripts\promote.ps1

# ❌ No hagas merges manuales:
# git merge main  # ← El script ya lo hace
```

---

## 🔧 CONFIGURACIÓN RECOMENDADA

### En GitHub (Settings → Branches)
```
✅ Protect main branch
  └─ Require pull request reviews
  └─ Require status checks to pass
  └─ Require branches to be up to date

✅ Protect preview branch
  └─ Same as main

✅ Protect production branch
  └─ Same as main

✅ Allow development to be unprotected
  └─ Facilita merges rápidos

✅ Allow perplexity/feat to be unprotected
  └─ Facilita PRs rápidos
```

### En Git local (tu config)
```bash
# Alias útiles
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# Alias para ejecutar promote
git config --global alias.promote '!powershell -Command ".\\scripts\\promote.ps1"'

# Entonces puedes hacer:
git promote
```

---

## 📞 COMUNICACIÓN

### Cuando termino un batch:
```
💬 "Batch 1 completado en perplexity/feat
   - PR creado: #XX
   - Changes: Naming, Location, Meta tags
   - Ready para test en tu development"
```

### Cuando das visto bueno:
```
💬 "✅ LGTM - Ejecutando .\scripts\promote.ps1
   Todas las ramas sincronizadas automáticamente"
```

### Si encuentro blocking issue:
```
💬 "⚠️ Necesito clarificación en X.
   ¿Debería [opción A] o [opción B]?"
```

---

## ✅ CHECKLIST FINAL

### Antes de comenzar:
- [ ] Entiendo el workflow
- [ ] `promote.ps1` está actualizado
- [ ] Rama: `perplexity/feat` existe
- [ ] Git está configurado
- [ ] Ramas están actualizadas

### Durante la sesión 2:
- [ ] Yo desarrollo en perplexity/feat
- [ ] Creo PRs claros
- [ ] Tú pruebas en development
- [ ] Tú ejecutas `./scripts/promote.ps1`
- [ ] Todo sincronizado automáticamente

### Al final de Session 2:
- [ ] Todos los cambios en todas las ramas
- [ ] development = main = preview = production
- [ ] perplexity/feat sincronizado con main
- [ ] Histórico Git completo y limpio
- [ ] Ready para Session 3 (testing + deploy)

---

## 🚀 ESTAMOS LISTOS

**Plan confirmado:**
1. Yo: `perplexity/feat` (implementación)
2. Tú: `development` (testing + validación)
3. Tú: `./scripts/promote.ps1` (sincronización automática)
4. Resultado: Todas las ramas alineadas

**Ventaja**: El script hace TODO, solo ejecuta una línea y listo.

¿Comenzamos? 🚀

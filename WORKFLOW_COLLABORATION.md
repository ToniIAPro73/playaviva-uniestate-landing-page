# 🤝 WORKFLOW COLABORATIVO - SESSION 2

**Establecido**: Diciembre 19, 2025 - 05:40 AM CET
**Flujo**: Paralelo con validación y merge centralizado

---

## 📐 ARQUITECTURA DEL WORKFLOW

```
┌─────────────────────────────────────────────────────────────┐
│                   TU MÁQUINA LOCAL                           │
│                    (Branch: development)                     │
│                                                               │
│  ✅ Testing local                                            │
│  ✅ Validación UX/UI                                         │
│  ✅ QA funcional                                             │
│  ✅ Aprobación final                                         │
└─────────────────────────────────────────────────────────────┘
                          ⬆️ PULL REQUEST
                    (yo promoveré cambios)
┌─────────────────────────────────────────────────────────────┐
│              SESSION 2 BRANCH (Esta rama)                    │
│         (session-2/azure-bay-rebranding)                    │
│                                                               │
│  🔨 Implementación de cambios                               │
│  📝 Find & Replace operations                               │
│  🖼️ Image integration                                       │
│  📊 Data updates                                            │
└─────────────────────────────────────────────────────────────┘
                          ⬇️ MERGE (aprobado por ti)
┌─────────────────────────────────────────────────────────────┐
│            BRANCHES FINALES (TÚ controlas)                   │
│                                                               │
│  📌 main (producción estable)                               │
│  🔵 preview (staging/demo)                                  │
│  🟢 production (live)                                       │
│  ⭐ session-2/azure-bay-rebranding (feature branch)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 👨‍💻 MIS RESPONSABILIDADES (En session-2/azure-bay-rebranding)

### ✅ Haré:

1. **Análisis y Implementación**
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

- ❌ Push a otras ramas (solo trabajar en session-2)
- ❌ Desplegar a Vercel
- ❌ Tomar decisiones de merge
- ❌ Testing en ambiente de producción
- ❌ Merge a main/preview/production

---

## 👤 TUS RESPONSABILIDADES (Rama development)

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

4. **Merge Centralizado**
   - [ ] Pull cambios de session-2 a development
   - [ ] Resolver conflictos si existen
   - [ ] Hacer commit final
   - [ ] Push a main, preview, production, session-2 simultáneamente
   - [ ] Sincronizar todas las ramas

---

## 🔄 FLUJO DE TRABAJO PASO A PASO

### CICLO DE CADA CAMBIO

#### PASO 1: Yo desarrollo en session-2
```bash
# Estoy en esta rama
git branch
# session-2/azure-bay-rebranding ← aquí estoy

# Hago cambios
echo "// Azure Bay updates" >> app/page.tsx

# Commit atómico
git add app/page.tsx
git commit -m "[Session 2] Replace project name: Playa Viva → Azure Bay Residences"
```

#### PASO 2: Yo creo PR a tu development
```bash
# Crear PR (por GitHub UI o CLI)
gh pr create \
  --base development \
  --head session-2/azure-bay-rebranding \
  --title "[Session 2] Azure Bay Rebranding - Batch 1" \
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
git merge origin/session-2/azure-bay-rebranding

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

#### PASO 5: Tú sincronizas todas las ramas
```bash
# En TU máquina, en development
git status
# On branch development
# your branch is ahead of 'origin/development' by 3 commits

# Push a development
git push origin development

# Sincroniza con main
git checkout main
git pull origin main
git merge development
git push origin main

# Sincroniza con preview
git checkout preview
git pull origin preview
git merge main
git push origin preview

# Sincroniza con production (si aplica)
git checkout production
git pull origin production
git merge main
git push origin production

# Sincroniza mi rama
git checkout session-2/azure-bay-rebranding
git pull origin session-2/azure-bay-rebranding
git merge main
git push origin session-2/azure-bay-rebranding
```

#### PASO 6: Confirmación
```
✅ development: contiene todos los cambios
✅ main: sincronizado con development
✅ preview: sincronizado con main
✅ production: sincronizado con main
✅ session-2/azure-bay-rebranding: sincronizado con main
```

---

## 📋 ESTADO DE RAMAS EN CUALQUIER MOMENTO

```
main
├─ development (TÚ trabajas aquí después de mi PR)
│  └─ Contiene todos mis cambios probados
├─ preview (deploy automático - staging)
│  └─ Espejo de main
├─ production (deploy automático - live)
│  └─ Espejo de main
└─ session-2/azure-bay-rebranding (MI rama de trabajo)
   └─ Sincronizado con main después de tus merges
```

---

## 📊 CICLO DE CAMBIOS - TIMELINE

### Batch 1: Naming & Location (Ejemplo)

```
⏱️ T+0min: Yo comienzo en session-2
  └─ Find & Replace: "Playa Viva" → "Azure Bay"
  └─ Actualizar ubicación
  └─ Commit: "[Session 2] Replace project name"

⏱️ T+15min: Creo PR a development
  └─ PR Title: "[Session 2] Azure Bay Naming - Batch 1"
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

⏱️ T+50min: Tú sincronizas todas las ramas
  └─ Push a main
  └─ Push a preview
  └─ Push a production (si aplica)
  └─ Push a session-2
  └─ Todas alineadas ✅

⏱️ T+55min: Siguiente batch
  └─ Yo continúo en session-2
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

✅ **Rapidez**
- Paralelo mientras pruebas
- No esperas a que haga PRs
- Múltiples cambios en flight

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
git pull origin session-2/azure-bay-rebranding

# ❌ Incorrecto: Yo no hago push a main/preview/production
git push origin main  # ← NO, nunca
```

### 2. **Merge centralizado SOLO por ti**
```bash
# ✅ Solo tú:
git checkout main && git merge development && git push

# ❌ Yo no:
git checkout main && git merge session-2/...  # ← NO
```

### 3. **PRs como comunicación**
```bash
# ✅ Cada batch de cambios = 1 PR
git commit -m "[Session 2] Batch 1: Naming & Location"
gh pr create --base development --head session-2/...

# ❌ Muchos commits sin PR
# Sin contexto de qué cambió y por qué
```

### 4. **Commits con contexto**
```bash
# ✅ Mensaje claro
git commit -m "[Session 2] Replace project name: Playa Viva → Azure Bay Residences

Changes:
- Update hero title (ES/EN)
- Update structured data
- Update content objects
- Update meta tags

Lines: 110-125, 180-500, 1150"

# ❌ Vago
git commit -m "updates"  # ← No
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
```

### En Git local (tu config)
```bash
# Alias útiles
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# Para sincronizar todas las ramas más fácil:
git config --global alias.sync-all '!git fetch && \
  git checkout main && git merge development && git push && \
  git checkout preview && git merge main && git push && \
  git checkout production && git merge main && git push && \
  git checkout session-2/azure-bay-rebranding && git merge main && git push'
```

---

## 📞 COMUNICACIÓN

### Cuando termino un batch:
```
💬 "Batch 1 completado en session-2/azure-bay-rebranding
   - PR creado: #XX
   - Changes: Naming, Location, Meta tags
   - Ready para test en tu development"
```

### Cuando das visto bueno:
```
💬 "✅ LGTM - Procediendo a sincronizar todas las ramas
   development → main → preview → production → session-2"
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
- [ ] Tengo acceso a desarrollo local
- [ ] Git está configurado
- [ ] Ramas están actualizadas

### Durante la sesión 2:
- [ ] Yo desarrollo en session-2
- [ ] Creo PRs claros
- [ ] Tú pruebas en development
- [ ] Tú sincronizas ramas
- [ ] Todo aligned

### Al final de Session 2:
- [ ] Todos los cambios en todas las ramas
- [ ] development = main = preview = production
- [ ] session-2 sincronizado con main
- [ ] Histórico Git completo y limpio
- [ ] Ready para Session 3 (testing + deploy)

---

## 🚀 ESTAMOS LISTOS

**Plan confirmado:**
1. Tú: development (testing + validación)
2. Yo: session-2/azure-bay-rebranding (implementación)
3. Tú: Sincronización centralizada
4. Resultado: Todas las ramas alineadas

**¿Comenzamos?** Avísame cuando estés listo y empiezo Batch 1 en session-2. 🚀

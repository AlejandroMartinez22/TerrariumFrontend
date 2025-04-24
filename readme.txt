Cambios realizados 22/04

1. Se creó el folder api, con el archivo index.js para conectar con el backend. Funcionando y Documentado.
2. Se modificó el hook auth.js. Funcionando y Documentado.
3. Se modificó el hook useLogin.js. Funcionando y Documentado.
4. Se modificó el archivo getName.js, y se movió de la carpeta supabase a la carpeta api, ya que ahora no tiene nada que ver con supabase.
5. De momento el archivo supabaseClient.js se mantiene, y sigue en la carpeta supabase

Cambios realizados 23/04

1. Se añadieron nuevas funciones al api/index.js
2. Se modificó el archivo brigadistaContext.js
3. Se eliminó el archivo getInfoBrigadista de la carpeta supabase
4. Se eliminó el archivo updateTutorialCompletado de la carpeta supabase.
5. Se modificó el hook signOut.js
6. Se añadieron funciones al api/index.js
7. Se modificó el hook useCoordenadas.js
8. Se eliminó el archivo getCoordenadas de la carpeta supabase
9. se modificó el archivo subparcelaContext
10. Se modificó el mapscreen.js
11. Se modifico el archivo useCentrosPoblados.js´

--- Alejandro ----

1. Se eliminó el archivo getUltimoIdReferencia de /Supabase
2. Se modificó el hook useReferencia.js
3. Se añadió la función fetchSiguienteIdReferencia en el api/index.js
4. Se eliminó el archivo addReferencia.js
5. Se modificó el hook useReferencia.js
6. Se añadió la función guardarReferenciaEnBackend en el api/index.js
7. Se añadío la función actualizarReferenciaEnBackend en el api/index.js
8. Se modificó el hook useReferencia.js
9. Se eliminó el archivo updateReferencia.js de la carpeta supabase.
10. Se añadió la función eliminarReferenciaEnBackend en el api/index.js
11. Se eliminó el archivo getReferenciaPorId de la carpeta supabase.
12. Se añadió la función al index.
13. se modificó el hook useReferencia.js

-- Aqui surgió un error por que el modal de punto de Referencia usaba el archivo getReferenciaPorId. --

14. Se cambió la importación en este modal

-- Aqui surgió un error por que el hook useTrayecto que usaba el archivo getReferenciaPorId. --

15. Se cambió la importación en este hook

16. Se eliminó el archivo getPuntosReferencia.js de la carpeta supabase (Chao papá)
17. Se añadió la función al index.js del api.
18. Se modificó el context ReferenciaContext.js, cambiando la importación

-- Aqui surgió un error por que el hook usePuntosReferencia usaba el archivo getPuntosReferencia --

19. Se modificó la importación en este hook






Trabajando en hook useReferencia.js

1. ../supabase/getUltimoIdReferencia -- listo


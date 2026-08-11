WITH columns_info AS (
    SELECT 
        table_name,
        jsonb_agg(
            jsonb_build_object(
                'columna', column_name,
                'tipo', data_type,
                'nullable', is_nullable,
                'default', column_default
            ) ORDER BY ordinal_position
        ) AS columnas
    FROM information_schema.columns
    WHERE table_schema = 'public'
    GROUP BY table_name
),
triggers_info AS (
    SELECT 
        c.relname AS table_name,
        jsonb_agg(
            jsonb_build_object(
                'trigger', t.tgname,
                'funcion', p.proname,
                'codigo_fuente', pg_get_functiondef(p.oid)
            )
        ) AS triggers
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE n.nspname = 'public' AND NOT t.tgisinternal
    GROUP BY c.relname
),
rls_info AS (
    SELECT 
        tablename AS table_name,
        jsonb_agg(
            jsonb_build_object(
                'politica', policyname,
                'comando', cmd,
                'roles', roles,
                'condicion_using', qual,
                'condicion_with_check', with_check
            )
        ) AS politicas_rls
    FROM pg_policies
    WHERE schemaname = 'public'
    GROUP BY tablename
)
SELECT jsonb_pretty(
    jsonb_agg(
        jsonb_build_object(
            'tabla', c.table_name,
            'columnas', c.columnas,
            'triggers', COALESCE(t.triggers, '[]'::jsonb),
            'politicas_rls', COALESCE(r.politicas_rls, '[]'::jsonb)
        )
    )
) AS estructura_completa
FROM columns_info c
LEFT JOIN triggers_info t ON c.table_name = t.table_name
LEFT JOIN rls_info r ON c.table_name = r.table_name;
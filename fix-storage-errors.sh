#!/bin/bash

echo "🔧 Fixing storage hook parameter mismatches"
echo "==========================================="

# use-secure-storage.ts has catch (_err) but uses _error
echo "📝 Fixing use-secure-storage.ts..."
perl -i -pe 's/} catch \(_err\) \{/} catch (_error) {/g' hooks/storage/use-secure-storage.ts

echo "✅ Storage hooks fixed!"


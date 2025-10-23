#!/bin/bash

echo "🔧 Fixing all _err vs _error mismatches"
echo "======================================"

# Fix all files that have catch (_err) but use _error in the body
echo "📝 Fixing catch (_err) -> catch (_error)..."
perl -i -pe 's/} catch \(_err\) \{/} catch (_error) {/g' hooks/storage/use-async-storage.ts
perl -i -pe 's/} catch \(_err\) \{/} catch (_error) {/g' hooks/storage/use-local-storage.ts
perl -i -pe 's/} catch \(_err\) \{/} catch (_error) {/g' hooks/device/use-clipboard.ts
perl -i -pe 's/} catch \(_err\) \{/} catch (_error) {/g' hooks/device/use-share.ts
perl -i -pe 's/} catch \(_err\) \{/} catch (_error) {/g' hooks/utility/use-infinite-scroll.ts

echo "✅ Fixed all _err -> _error conversions"


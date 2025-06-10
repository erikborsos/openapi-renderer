<script lang="ts">
	import { Badge } from "$lib/components/ui/badge"
	import { cn } from "$lib/utils"

	let { method, class: className }: { method: string; class?: string } = $props()

	function getBadgeClass(method: string): string {
		switch (method.toLowerCase()) {
			case "get":
				return "bg-green-100 text-green-800"
			case "post":
				return "bg-blue-100 text-blue-800"
			case "put":
				return "bg-yellow-100 text-yellow-800"
			case "delete":
				return "bg-red-100 text-red-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}
</script>

<Badge variant="outline" class={cn(className, getBadgeClass(method))}>
	{method.toUpperCase()}
</Badge>

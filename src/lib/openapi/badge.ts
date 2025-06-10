export function getBadgeColor(type: string): string {
	type = type.toLowerCase()
	switch (type) {
		case "get":
			return "text-green-500 dark:text-green-400"
		case "post":
			return "text-blue-500 dark:text-blue-400"
		case "put":
			return "text-yellow-500 dark:text-yellow-400"
		case "delete":
			return "text-red-500 dark:text-red-400"
		case "patch":
			return "text-orange-500 dark:text-orange-400"
		case "head":
			return "text-purple-500 dark:text-purple-400"
		case "options":
			return "text-teal-500 dark:text-teal-400"
		case "trace":
			return "text-pink-500 dark:text-pink-400"
		default:
			return "text-gray-500 dark:text-gray-400"
	}
}

export function getBadgeBackgroundColor(type: string): string {
	type = type.toLowerCase()
	if (type === "get") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
	if (type === "post") return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
	if (type === "put") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
	if (type === "delete") return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
	if (type === "patch")
		return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
	if (type === "head")
		return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
	if (type === "options") return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
	if (type === "trace") return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
	return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
}

export function getBadgeStyle(type: string): string {
	return `${getBadgeBackgroundColor(type)} ${getBadgeColor(type)}`
}

import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {

	return (
		<main className="flex h-screen flex-col items-center justify-center bg-background px-6 overflow-hidden">
			<div className="flex flex-col items-center justify-center gap-8 text-center max-w-3xl">
				<div className="space-y-4">
					<h1 className="font-sans text-5xl md:text-7xl font-medium tracking-tight text-foreground text-balance leading-tight">
						Your pet's home away from home
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto text-pretty">
						Trusted care for your furry friends when you need it most
					</p>
				</div>

				<Link
					to="/login"
					className="bg-neutral-900 px-8 py-3 text-lg font-medium text-white rounded-xl shadow-sm hover:shadow-md transition-all"
				>
					Log in
				</Link>
			</div>
		</main>
	);
}

export default Index;

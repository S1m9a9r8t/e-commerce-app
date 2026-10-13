import { getCategories } from "@/lib/api/categories";

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Nexus Store</h1>
      <ul className="mt-4 space-y-1">
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </main>
  );
}
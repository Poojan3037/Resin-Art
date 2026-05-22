import { getProducts } from "@/actions/product";
import AdminProductsManager from "@/components/admin/products/AdminProductsManager";

type PagePropsType = {
  searchParams: Promise<{ search?: string }>;
};

const AdminProductsPage = async ({ searchParams }: PagePropsType) => {
  const { search = "" } = await searchParams;
  const products = await getProducts({ search });

  return <AdminProductsManager products={products} />;
};

export default AdminProductsPage;

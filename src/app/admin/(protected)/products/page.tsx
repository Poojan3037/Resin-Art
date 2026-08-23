import { getProducts } from "@/actions/product";
import { getSubscriberCount } from "@/actions/subscriber";
import AdminProductsManager from "@/components/admin/products/AdminProductsManager";

type PagePropsType = {
  searchParams: Promise<{ search?: string }>;
};

const AdminProductsPage = async ({ searchParams }: PagePropsType) => {
  const { search = "" } = await searchParams;
  const [products, subscriberCount] = await Promise.all([
    getProducts({ search }),
    getSubscriberCount(),
  ]);

  return (
    <AdminProductsManager
      products={products}
      subscriberCount={subscriberCount}
    />
  );
};

export default AdminProductsPage;

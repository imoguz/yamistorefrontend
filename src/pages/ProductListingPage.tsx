import { Box, Divider, Grid, Pagination, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { readProducts } from "../features/productSlice";
import FilterAccordion from "../components/productListing/FilterAccordion";
import LoadingSkeleton from "../components/productListing/Skeleton";
import ProductCard from "../components/productListing/ProductCard";
import ErrorPage from "./ErrorPage";

const ProductListingPage = () => {
  const dispatch = useAppDispatch();
  const { mainMenu, subMenu, childMenu } = useParams();
  const { loading, error } = useAppSelector((state) => state.products);
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [paginationCount, setPaginationCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const pageSize = 6;
  const fetchProducts = async (page: number) => {
    const query = {
      subcategory: childMenu,
      midcategory: subMenu,
      topcategory: mainMenu,
      page: page,
      limit: pageSize,
    };
    const data = await dispatch(readProducts(query));
    setProductList(data.payload as IProduct[]);
  };

  const fetchAllProducts = async () => {
    const query = {
      subcategory: childMenu,
      midcategory: subMenu,
      topcategory: mainMenu,
    };
    const data = await dispatch(readProducts(query));
    setPaginationCount(
      Math.ceil((data.payload as IProduct[]).length / pageSize)
    );
  };

  useEffect(() => {
    fetchAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, mainMenu, subMenu, childMenu]);

  if (error) {
    return <ErrorPage error={error} />;
  }

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    fetchProducts(value);
    setPage(value);
    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth",
    // });
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid item xs={2} sx={{ position: "sticky", top: 0 }}>
        <FilterAccordion />
      </Grid>

      <Grid
        item
        pt={2}
        xs={10}
        sx={{
          overflowY: "auto",
          maxHeight: "100vh",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mx: "auto",
            width: "97%",
            mt: 1,
          }}
        >
          <Typography variant="h5">
            {childMenu && childMenu[0].toUpperCase() + childMenu?.slice(1)}
          </Typography>
          <Typography variant="h6" mr={2}>
            Items
          </Typography>
        </Box>
        <Divider sx={{ height: 0, backgroundColor: "black", mr: 2 }} />
        <Grid container spacing={2} mt={1}>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            productList?.map((product, index) => (
              <Grid key={index} item>
                <ProductCard product={product} />
              </Grid>
            ))
          )}
        </Grid>
        <Grid my={4} display="flex" justifyContent="center">
          <Pagination
            count={paginationCount}
            page={page}
            variant="outlined"
            shape="rounded"
            color="primary"
            onChange={handlePaginationChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductListingPage;

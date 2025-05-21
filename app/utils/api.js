export async function getProductById(id) {
  console.log('idid', id);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/v1/product/getsingle?productId=${id}`, {
      headers: {
        authorisedKey: "HVTKBpx6UFTpwRTQds74gz3jcIlc5Nom",
      },
    });

    console.log('resresresresresresres', res);

    if (!res.ok) throw new Error("Failed to fetch product");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

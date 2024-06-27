// constants.js
const createCategory = "createCategory";
const deleteCategory = "deleteCategory";
const updateCategory = "updateCategory";

const createCategoryFeaturedProduct="createCategoryFeaturedProduct";
const updateCategoryFeaturedProduct="updateCategoryFeaturedProduct";

const createCoupon="createCoupon"
const deleteCoupon="deleteCoupon"
const fetchAllCoupon="fetchAllCoupon"
const applyCoupon="applyCoupon"

const createEnergySection="createEnergySection"
const updateEnergySection="updateEnergySection"
const deleteEnergySection="deleteEnergySection"

const createFlavour="createFlavour"
const updateFlavour="updateFlavour"
const deleteFlavour="deleteFlavour"


const createFooter="createFooter"

const createGoal="createGoal"
const updateGoal="updateGoal"
const deleteGoal="deleteGoal"

const createHero="createHero"
const updateHero="updateHero"
const deleteHero="deleteHero"

const createOrder="createOrder"
const updateOrder="updateOrder"
const fetchAllOrder="fetchAllOrder"
const fetchOrderByUserId="fetchOrderByUserId"
const fetchOrderByProductId="fetchOrderByProductId"

const createProduct="createProduct"
const updateProduct="updateProduct"
const deleteProduct="deleteProduct"

const createReview="createReview"
const fetchReview="fetchReview"

const updateProfile="updateProfile"

const createPromoProduct="createPromoProduct"
const updatePromoProduct="updatePromoProduct"
const deletePromoProduct="deletePromoProduct"

const createShopByCategory='createShopByCategory'
const deleteShopByCategory='deleteShopByCategory'

const createCustomerAddress='createCustomerAddress'
const updateCustomerAddress='updateCustomerAddress'
const deleteCustomerAddress='deleteCustomerAddress'
const fetchCustomerAddress='fetchCustomerAddress'
const permissionsList=[
    createCategory,
    deleteCategory,
    updateCategory,
    createCategoryFeaturedProduct,
    updateCategoryFeaturedProduct,
    createCoupon,
    deleteCoupon,
    fetchAllCoupon,
    applyCoupon,
    createEnergySection,
    updateEnergySection,
    deleteEnergySection,
    createFlavour,
    updateFlavour,
    deleteFlavour,
    createFooter,
    createGoal,
    updateGoal,
    deleteGoal,
    createHero,
    updateHero,
    deleteHero,
    createOrder,
    updateOrder,
    fetchAllOrder,
    fetchOrderByUserId,
    fetchOrderByProductId,
    createProduct,
    updateProduct,
    deleteProduct,
    createReview,
    fetchReview,
    updateProfile,
    createPromoProduct,
    updatePromoProduct,
    deletePromoProduct,
    createShopByCategory,
    deleteShopByCategory,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    fetchCustomerAddress
    ]
    const formattedPermissions = permissionsList.map((permission, index) => ({
        id: index + 1,
        name: permission
      }));
module.exports = {
    createCategory,
    deleteCategory,
    updateCategory,
    createCategoryFeaturedProduct,
    updateCategoryFeaturedProduct,
    createCoupon,
    deleteCoupon,
    fetchAllCoupon,
    applyCoupon,
    createEnergySection,
    updateEnergySection,
    deleteEnergySection,
    createFlavour,
    updateFlavour,
    deleteFlavour,
    createFooter,
    createGoal,
    updateGoal,
    deleteGoal,
    createHero,
    updateHero,
    deleteHero,
    createOrder,
    updateOrder,
    fetchAllOrder,
    fetchOrderByUserId,
    fetchOrderByProductId,
    createProduct,
    updateProduct,
    deleteProduct,
    createReview,
    fetchReview,
    updateProfile,
    createPromoProduct,
    updatePromoProduct,
    deletePromoProduct,
    createShopByCategory,
    deleteShopByCategory,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    fetchCustomerAddress,
    formattedPermissions
};

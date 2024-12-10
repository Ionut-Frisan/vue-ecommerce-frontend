<template>

</template>

<script setup>
import {useProductStore} from "../stores/product";
import {computed, ref} from "vue";
import {useCartStore} from "../stores/cart";
import {useToast} from "primevue/usetoast";
import {addToFavorite, removeFromFavorites} from "../managers/RequestManagers/favorite";

const props = defineProps({
    product: {
        type: Object,
        required: true
    },
    authenticated: Boolean,
    hasFavorite: {
        type: Boolean,
        default: true
    },
    hasAdd: {
        type: Boolean,
        default: true
    },
    hasRating: {
        type: Boolean,
        default: true
    },
    readOnlyRating: {
        type: Boolean,
        default: false
    },
    hasDiscountBadge: {
        type: Boolean,
        default: true
    },
    layout: {
        type: String,
        default: "card",
        validator(value) {
            return ['card', 'full'].includes(value);
        }
    },
    count: {
        type: Number,
        default: 0,
    },
    showAddButton: {
        type: Boolean,
        default: false,
    }
})

const productStore = useProductStore();

const imageUrl = computed(() => {
    if (Array.isArray(props.product.images)) {
        if (props.product.images.length)
            return `${uploadsUrl}/${props.product.images[0]}`
        return `${uploadsUrl}/no-photo.jpeg`
    }
    return `${uploadsUrl}/${props.product.images}`
})

const rating = computed(() => {
    return props.product?.averageRating ? props.product?.averageRating.toString() : 'No reviews yet';
})

const start = computed(() => {
    return Math.ceil(props.product?.averageRating || 0)
})

const computedTitle = computed(() => {
    // Clips the title if it's above certain length
    if (props.product.name.length > 35) {
        return props.product.name.slice(0, 35) + '...'
    }
    return props.product.name
})

const computedPrice = computed(() => {
    return props.product.price * (1 - props.product.discount / 100);
})

const computedBadges = (() => {

})

const priceWholePart = computed(() => {
    return Math.floor(computedPrice.value)
})

const priceFloatPart = computed(() => {
    let value = computedPrice.value - priceWholePart.value;
    value = Math.round(value * 100).toString();
    return value.length === 2 ? value : value + '0'
})

const hasDiscount = computed(() => {
    return props.product.discount !== 0
})

const isFavoritesButtonHovered = ref(false);

const favoritesButtonClasses = computed(() => {
    let classes = 'p-button-rounded product-card-favorites-button p-button-lg'
    if (isFavoritesButtonHovered.value) {
        if (!props.product.favorite)
            classes = `${classes} p-button-danger`
        else
            classes = `${classes} p-button-secondary`
    } else {
        if (props.product.favorite)
            classes = `${classes} p-button-danger`
        else
            classes = `${classes} p-button-text  p-button-secondary`
    }
    return classes;
})

// actions
const cartStore = useCartStore();
const toast = useToast();

const addToCart = () => {
    cartStore.addToCart({product: props.product, quantity: 1});
    toast.add({severity: 'success', detail: 'Product was added to cart', life: 3000});
}

const toggleFavorite = async () => {
    if (!props.product.favorite) {
        const res = await addToFavorite(props.product._id || props.product.id)
        if (res.success) {
            productStore.favoritesCount += 1;
            productStore.setFavoriteValue(props.product._id || props.product.id, true)
        }
    } else {
        const res = await removeFromFavorites(props.product._id || props.product.id)
        if (res.success) {
            productStore.favoritesCount -= 1;
            productStore.setFavoriteValue(props.product._id || props.product.id, false)
        }
    }
}

</script>

<style scoped>

</style>
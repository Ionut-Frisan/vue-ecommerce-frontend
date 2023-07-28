<template>
  <div :class="classes">
    <span>{{labelComputed}} &nbsp</span>
    <span>{{valueComputed}}</span>
  </div>
</template>
<script setup>
import {computed} from "vue";

const props = defineProps({
    value: {
        type: String,
        default: "--",
    },
    label: String,
    labelPosition: String,
})

const noValueIndicator = '--';

const valueComputed = computed(() => typeof props.value === "string" && !!props.value ? props.value : noValueIndicator)
const labelComputed = computed(() => typeof props.label === "string" && !!props.label ? props.label : undefined)
const classes = computed(() => ['readonly-value', {'label-top': props.labelPosition === 'top'}])
</script>

<style>
.readonly-value{
    margin: 0.5rem 0.2rem;
}
.readonly-value.label-top span:first-of-type{
  display: block;
}
.readonly-value span:last-of-type{
  color: #5f6063;
}
</style>
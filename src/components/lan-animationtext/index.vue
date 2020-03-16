<template>
    <div class="lan-animationtext">

        <p v-for="(s, index) in text" :key="index">
            {{ s }}
        </p>

    </div>
</template>
<script>
export default {
    name: "lanAnimationText",
    props: {
        text: {
            type: String,
            default: ""
        }
    }
};
</script>

<style lang="scss" scoped>
$effect: hover 1.375s linear infinite;
.lan-animationtext {
    width: 100%;
    text-align: center;
    p {
        display: inline-block;
        text-align: center;
        font-size: 46px;
        font-family: arial;
        transform: scale(.5);
        color: #121212;
        -webkit-text-stroke: 2px gray;
    }
    p:nth-child(1) { animation: $effect; }
    p:nth-child(2) { animation: $effect 0.125s; }
    p:nth-child(3) { animation: $effect 0.25s; }
    p:nth-child(4) { animation: $effect 0.375s; }
    p:nth-child(5) { animation: $effect 0.5s; }
    p:nth-child(6) { animation: $effect 0.625s; }
    p:nth-child(7) { animation: $effect 0.75s; }
    p:nth-child(8) { animation: $effect 0.875s; }
    p:nth-child(9) { animation: $effect 1s; }
    p:nth-child(10) { animation: $effect 1.125s; }
    p:nth-child(11) { animation: $effect 1.25s; }
}

@keyframes hover {
    0% {
        transform: scale(.5);
        color: #121212;
        -webkit-text-stroke: 2px gray;
    }
    20% {
        transform: scale(1);
        color: pink;
        -webkit-text-stroke: 3px red;
        filter: drop-shadow(0 0 1px black)drop-shadow(0 0 1px black)drop-shadow(0 0 3px red)drop-shadow(0 0 5px red)hue-rotate(10turn);
    }
    50% {
        transform: scale(.5);
        color: #121212;
        -webkit-text-stroke: 2px gray;
    }
}
</style>

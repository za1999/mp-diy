<template>
    <view class="screen" :style="{ backgroundColor: current.hex }" @tap="nextColor" @longpress="exit"
        @touchstart="onTouchStart" @touchend="onTouchEnd">
        <view class="top-bar" :style="{ color: labelColor }">

        </view>

        <!-- 新增：切换时居中短暂显示颜色名称 -->
        <view v-show="showLabelFlash" class="overlay-label" :style="{ color: labelColor }">
            {{ current.name }}
        </view>

        <!-- 新增：涟漪反馈 -->
        <view v-for="r in ripples" :key="r.id" class="ripple"
            :style="{ left: r.x + 'px', top: r.y + 'px', borderColor: labelColor }" />

        <view v-if="showTip" class="tip">
            请在暗光环境下使用，建议将屏幕亮度调至最高。点击屏幕切换颜色观察坏点。上滑、长按或点右上角退出。
        </view>

        <!-- 新增：底部常驻提示 -->
        <view class="footer-hint" :style="{ color: labelColor }">
            点击屏幕切换颜色，上滑或长按退出
        </view>


    </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { onShow, onHide } from '@dcloudio/uni-app';

type ColorItem = { name: string; hex: string };
const colors: ColorItem[] = [
    { name: '红色', hex: '#ff0000' },
    { name: '绿色', hex: '#00ff00' },
    { name: '蓝色', hex: '#0000ff' },
    { name: '白色', hex: '#ffffff' },
    { name: '黑色', hex: '#000000' },
    { name: '灰色', hex: '#808080' }
];

const idx = ref(0);
const current = computed(() => colors[idx.value]);
const showTip = ref(true);

// 新增：切换时的居中标签闪现
const showLabelFlash = ref(false);

// 新增：涟漪反馈与触点记录
type Ripple = { id: number; x: number; y: number };
const ripples = ref<Ripple[]>([]);
const lastTouch = ref({ x: 0, y: 0 });

function createRipple(x: number, y: number) {
    const id = Date.now() + Math.random();
    ripples.value.push({ id, x, y });
    setTimeout(() => {
        ripples.value = ripples.value.filter(r => r.id !== id);
    }, 450);
}

function nextColor() {
    idx.value = (idx.value + 1) % colors.length;
    // 反馈：涟漪 + 短震动 + 居中标签闪现
    createRipple(lastTouch.value.x, lastTouch.value.y);
    if (uni.vibrateShort) {
        try { uni.vibrateShort({}) } catch { }
    }
    showLabelFlash.value = true;
    setTimeout(() => (showLabelFlash.value = false), 800);
}

function hexToRGB(hex: string) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return { r, g, b };
}
function luma(hex: string) {
    const { r, g, b } = hexToRGB(hex);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
const labelColor = computed(() => (luma(current.value.hex) > 0.5 ? '#000000' : '#ffffff'));

function syncNavBar() {
    const front = luma(current.value.hex) > 0.5 ? 'black' : 'white';
    uni.setNavigationBarColor({ frontColor: front, backgroundColor: current.value.hex });
}

function exit() {
    uni.showTabBar();
    // 尝试返回；若无历史可自行处理到首页
    uni.reLaunch({ url: '/pages/index' });

}

// 手势：上滑退出
const startY = ref(0);
const startTime = ref(0);
function onTouchStart(e: any) {
    const t = e.changedTouches?.[0];
    lastTouch.value.x = t?.clientX ?? 0;
    lastTouch.value.y = t?.clientY ?? 0;
    startY.value = t?.clientY || 0;
    startTime.value = Date.now();
}
function onTouchEnd(e: any) {
    const endY = e.changedTouches?.[0]?.clientY || 0;
    const deltaY = endY - startY.value;
    const dt = Date.now() - startTime.value;
    if (dt < 800 && deltaY < -120) exit();
}

onMounted(() => {
    syncNavBar();
    setTimeout(() => (showTip.value = false), 2500);
});
watch(current, syncNavBar);

</script>

<style scoped>
.screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    /* 防止滚动与选中 */
    overflow: hidden;
    touch-action: manipulation;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.top-bar {
    position: absolute;
    top: 18rpx;
    left: 24rpx;
    font-size: 28rpx;
    opacity: 0.85;
}

.tip {
    max-width: 80%;
    text-align: center;
    font-size: 26rpx;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(0, 0, 0, 0.28);
    padding: 20rpx;
    border-radius: 12rpx;
}

.screen[style*="background-color: #ffffff"] .tip {
    color: #334155;
    background: rgba(255, 255, 255, 0.7);
}



.overlay-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    font-size: 48rpx;
    font-weight: 700;
    opacity: 0;
    animation: fadeLabel 800ms ease-out forwards;
}

@keyframes fadeLabel {
    0% {
        opacity: 0;
    }

    20% {
        opacity: 0.9;
    }

    100% {
        opacity: 0;
    }
}

.ripple {
    position: absolute;
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    border: 4rpx solid currentColor;
    opacity: 0.6;
    pointer-events: none;
    animation: pulse 450ms ease-out forwards;
}

@keyframes pulse {
    0% {
        transform: translate(-50%, -50%) scale(0.2);
        opacity: 0.6;
    }

    100% {
        transform: translate(-50%, -50%) scale(1.6);
        opacity: 0;
    }
}

.footer-hint {
    position: absolute;
    bottom: 24rpx;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24rpx;
    opacity: 0.85;
    width: 200px;
}
</style>

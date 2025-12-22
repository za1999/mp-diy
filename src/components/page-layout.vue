<template>
    <view class="page-box">
        <view class="content">
            <slot></slot>
        </view>
    </view>
</template>

<style lang="scss">
page {
    height: 100%;
}

.page-box {
    height: 100%;
    display: flex;
    flex-direction: column;

    .content {
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px;
    }

}
</style>

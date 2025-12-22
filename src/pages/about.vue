<script setup lang="ts">
import PageLayout from '@/components/page-layout.vue';

const version = 'v0.4.0';
const buildTime = '2025-12-22';
const features = [
    { key: 'binary-chat', name: '二进制聊天', desc: '11100100 10111101 10100000 11100101 10100101 10111101' },
    { key: 'img-compress', name: '屏幕检测', desc: '看看有没有坏点什么的' },
];
</script>

<template>
    <PageLayout>
        <view class="about">
            <view class="hero">
                <view class="title">关于我们</view>
                <view class="subtitle">我们是一个轻量清爽的工具盒，聚合常用小工具，开箱即用。</view>
                <view class="meta">
                    <text class="chip">版本 {{ version }}</text>
                    <text class="chip">构建于 {{ buildTime }}</text>
                </view>
            </view>

            <view class="card">
                <view class="card-title">项目简介</view>
                <view class="card-body">
                    专注小而美的工具集合，保持简洁与效率：即点即用、无需学习成本、持续精炼体验。
                </view>
            </view>

            <view class="card">
                <view class="card-title">当前功能</view>
                <view class="feature-list">
                    <view v-for="f in features" :key="f.key" class="feature-item">
                        <text class="dot" /> <text class="feature-name">{{ f.name }}</text>
                        <text class="feature-desc">{{ f.desc }}</text>
                    </view>
                </view>
            </view>

            <view class="card">
                <view class="card-title">反馈与联系</view>
                <view class="card-body">
                    有想法或问题，欢迎反馈：我并不会留下反馈地址
                </view>
            </view>
        </view>
    </PageLayout>
</template>

<style lang="scss" scoped>
.about {
    padding: 24rpx;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.hero .title {
    font-size: 36rpx;
    font-weight: 700;
    color: #0f172a;
}

.hero .subtitle {
    margin-top: 8rpx;
    font-size: 26rpx;
    color: #475569;
    line-height: 1.6;
}

.meta {
    margin-top: 12rpx;
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
}

.chip {
    background: #eef2ff;
    color: #3730a3;
    border: 2rpx solid #e0e7ff;
    padding: 8rpx 14rpx;
    border-radius: 999rpx;
    font-size: 22rpx;
}

.card {
    background: #ffffff;
    border: 2rpx solid #e5e7eb;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.05);
}

.card-title {
    font-size: 30rpx;
    color: #0f172a;
    font-weight: 600;
    margin-bottom: 12rpx;
}

.card-body {
    font-size: 26rpx;
    color: #475569;
    line-height: 1.7;
}

.feature-list {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.feature-item {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 26rpx;
    color: #334155;
}

.dot {
    width: 12rpx;
    height: 12rpx;
    background: #38bdf8;
    border-radius: 50%;
    margin-right: 12rpx;
}

.feature-name {
    font-weight: 600;
    margin-right: 8rpx;
}

.feature-desc {
    margin-top: 6rpx;
    width: 100%;
    color: #64748b;
}
</style>

<script setup lang="ts">
import PageLayout from '@/components/page-layout.vue';
import { ref } from 'vue';

const tools = ref([
  { key: 'binary-chat', name: '二进制聊天', desc: 'COSPLAY机器人', path: 'pages/function-page/binary' },
  {
    key: 'screen-test',
    name: '屏幕坏点检测',
    desc: '点击屏幕依次切换颜色，检测坏点/偏色/漏光',
    path: 'pages/function-page/Screen-detection'
  },
  { key: 'img-compress', name: '图片压缩器', desc: '一键压小图，清晰更轻' },
  { key: 'ts-convert', name: '时间戳转换', desc: '毫秒与日期互转' },
  { key: 'json-format', name: 'JSON格式化', desc: '美化 / 压缩 JSON' },
  { key: 'base64', name: 'Base64 编解码', desc: '文本快速转换' },
  { key: 'password-gen', name: '密码生成器', desc: '安全随机' },
  { key: 'what-to-eat', name: '今天吃什么', desc: '选择困难症救星' },
  { key: 'color-gen', name: '随机配色', desc: '好看不纠结' }
])


const initials = (name: string) => name.slice(0, 1);
const toFunction = (value: { path?: string }) => {
  if (value.path) {
    uni.navigateTo({
      url: `/${value.path}`
    });
    return;
  }
  uni.showToast({
    title: '功能开发中，敬请期待！',
    icon: 'none'
  });
};
</script>

<template>
  <PageLayout>
    <view class="tool-list">
      <view v-for="t in tools" :key="t.key" class="tool-item" hover-class="tool-item--hover" @tap="toFunction(t)">
        <view class="tool-avatar">
          {{ initials(t.name) }}
        </view>
        <view class="tool-meta">
          <text class="tool-title">{{ t.name }}</text>
          <text class="tool-desc">{{ t.desc }}</text>
        </view>
        <text class="tool-arrow">›</text>
      </view>
    </view>
  </PageLayout>
</template>

<style lang="scss" scoped>
.tool-list {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  background: #ffffff;
  border: 2rpx solid #e5e7eb;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.12s ease, box-shadow 0.12s ease;

  &--hover {
    transform: translateY(-2rpx);
    box-shadow: 0 10rpx 24rpx rgba(0, 0, 0, 0.08);
  }
}

.tool-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 32rpx;
  background: linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%);
  flex-shrink: 0;
}

.tool-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
  /* 防止文本溢出 */
  flex: 1;
}

.tool-title {
  font-size: 30rpx;
  color: #0f172a;
  font-weight: 600;
}

.tool-desc {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #64748b;
}

.tool-arrow {
  color: #94a3b8;
  font-size: 36rpx;
  margin-left: 12rpx;
}
</style>

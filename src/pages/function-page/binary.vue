<template>
    <PageLayout>
        <view class="binary">
            <view class="seg">
                <view :class="['seg-item', mode === 'text2bin' ? 'active' : '']" @tap="mode = 'text2bin'">中文转二进制</view>
                <view :class="['seg-item', mode === 'bin2text' ? 'active' : '']" @tap="mode = 'bin2text'">二进制转中文</view>
            </view>

            <view class="card">
                <view class="label">{{ mode === 'text2bin' ? '输入中文' : '输入二进制（可用空格分隔）' }}</view>
                <textarea class="textarea" v-model="input" auto-height placeholder="在此输入..." />
                <view class="actions">
                    <button class="btn primary" @tap="convert">转换</button>
                    <button class="btn ghost" @tap="clearAll">清空</button>
                </view>
            </view>

            <view class="card">
                <view class="label">输出结果</view>
                <scroll-view scroll-y class="output">
                    <view v-if="!hasOutput" class="empty-tip">暂无输出，请先输入并点击转换</view>
                    <text v-else>{{ output }}</text>
                </scroll-view>
                <view class="actions" v-if="hasOutput">
                    <button class="btn secondary" @tap="copyOut">复制结果</button>
                </view>
            </view>

            <view class="tips">提示：采用 UTF-8 编码，中文会对应多个 8 位二进制字节。</view>
        </view>
    </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '@/components/page-layout.vue';
import { ref, computed } from 'vue';

const mode = ref<'text2bin' | 'bin2text'>('text2bin');
const input = ref('');
const output = ref('');

function utf8EncodeToBytes(str: string): Uint8Array {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str);
    const s = unescape(encodeURIComponent(str));
    return new Uint8Array(Array.from(s).map(c => c.charCodeAt(0)));
}

function utf8DecodeBytes(bytes: Uint8Array): string {
    if (typeof TextDecoder !== 'undefined') return new TextDecoder().decode(bytes);
    const pct = Array.from(bytes).map(b => '%' + b.toString(16).padStart(2, '0')).join('');
    return decodeURIComponent(pct);
}

function sanitizeBinary(s: string): string {
    return s.replace(/[^01]/g, '');
}

function convert() {
    if (mode.value === 'text2bin') {
        const bytes = utf8EncodeToBytes(input.value);
        output.value = Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' ');
    } else {
        const cleaned = sanitizeBinary(input.value);
        if (!cleaned) { output.value = ''; return; }
        if (cleaned.length % 8 !== 0) {
            uni.showToast({ title: '二进制长度需为 8 的倍数', icon: 'none' });
            return;
        }
        const arr: number[] = [];
        for (let i = 0; i < cleaned.length; i += 8) {
            arr.push(parseInt(cleaned.slice(i, i + 8), 2));
        }
        try {
            output.value = utf8DecodeBytes(new Uint8Array(arr));
        } catch {
            uni.showToast({ title: '解码失败', icon: 'none' });
        }
    }
}

function copyOut() {
    if (!output.value) {
        uni.showToast({ title: '无内容可复制', icon: 'none' });
        return;
    }
    uni.setClipboardData({
        data: output.value,
        success: () => uni.showToast({ title: '已复制', icon: 'success' })
    });
}

function clearAll() {
    input.value = '';
    output.value = '';
}

const hasOutput = computed(() => output.value.trim().length > 0);
</script>

<style lang="scss" scoped>
.binary {
    padding: 24rpx;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.seg {
    display: flex;
    background: #f1f5f9;
    border-radius: 999rpx;
    padding: 8rpx;
    gap: 8rpx;
}

.seg-item {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    border-radius: 999rpx;
    color: #334155;
    font-size: 26rpx;
}

.seg-item.active {
    background: #e0f2fe;
    color: #0ea5e9;
    font-weight: 600;
    border: 2rpx solid #bae6fd;
}

.card {
    background: #ffffff;
    border: 2rpx solid #e5e7eb;
    border-radius: 16rpx;
    padding: 20rpx;
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.05);
}

.label {
    font-size: 24rpx;
    color: #64748b;
    margin-bottom: 8rpx;
}

.textarea {
    width: 100%;
    min-height: 160rpx;
    background: #f8fafc;
    border: 2rpx solid #e5e7eb;
    border-radius: 12rpx;
    padding: 16rpx;
    font-size: 28rpx;
    color: #0f172a;
}

.actions {
    margin-top: 12rpx;
    display: flex;
    gap: 12rpx;
}

.btn {
    height: 72rpx;
    padding: 0 24rpx;
    border-radius: 12rpx;
    font-size: 28rpx;
}

.btn.primary {
    background: linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%);
    color: #ffffff;
    border: none;
}

.btn.secondary {
    background: #0ea5e9;
    color: #ffffff;
    border: none;
}

.btn.ghost {
    background: transparent;
    color: #0ea5e9;
    border: 2rpx solid #bae6fd;
}

.output {
    max-height: 240rpx;
    background: #f8fafc;
    border: 2rpx solid #e5e7eb;
    border-radius: 12rpx;
    padding: 16rpx;
}

.empty-tip {
    color: #94a3b8;
    font-size: 24rpx;
}

.tips {
    color: #94a3b8;
    font-size: 22rpx;
}
</style>

<script setup lang="js"></script>

<template>
    <div class="h-full w-full py-4 px-4 sm:px-6 lg:px-8 bg-surface-0 dark:bg-surface-950 transition-colors duration-200">
        <div class="max-w-full mx-auto h-full flex flex-col">
            <template v-if="$slots.header">
                <div class="mb-6 flex-shrink-0">
                    <slot name="header" />
                </div>
            </template>

            <div class="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                <template v-if="$slots.main">
                    <div class="flex-1 w-full min-w-0" :class="{ 'lg:pr-6': $slots.actions }">
                        <slot name="main" />
                    </div>
                </template>

                <template v-if="$slots.actions">
                    <div
                        class="w-full lg:w-auto lg:flex-shrink-0 flex flex-col items-start justify-start lg:border-l lg:border-surface-200 dark:lg:border-surface-700 lg:pl-6">
                        <div class="sticky top-4 w-full">
                             <slot name="actions" />
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
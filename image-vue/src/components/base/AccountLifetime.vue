<template>
  <p>{{ days }} : {{ hours }} : {{ minutes }} : {{ seconds }}</p>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { useStore } from '../../store';
import { useCountdown } from '../../composition/useCountdown';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AccountLifeTime',
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = store.state.userModule.user;

    const state = useCountdown(user.timeUntilDeletion, async () => {
      router.push({ name: 'home' });
      store.commit('userModule/RESET_STATE');
      store.commit('authModule/RESET_STATE');
    });

    return { ...state };
  }
});
</script>

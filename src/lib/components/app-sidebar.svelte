<script lang="ts">
  import { page } from '$app/stores';
  import BookOpen from 'lucide-svelte/icons/book-open';
  import Bot from 'lucide-svelte/icons/bot';
  import ChartPie from 'lucide-svelte/icons/chart-pie';
  import Frame from 'lucide-svelte/icons/frame';
  import Languages from 'lucide-svelte/icons/languages';
  import Map from 'lucide-svelte/icons/map';
  import Send from 'lucide-svelte/icons/send';
  import Settings2 from 'lucide-svelte/icons/settings-2';
  import SquareTerminal from 'lucide-svelte/icons/square-terminal';
  import NavMain from '$lib/components/nav-main.svelte';
  import NavProjects from '$lib/components/nav-projects.svelte';
  import NavSecondary from '$lib/components/nav-secondary.svelte';
  import NavUser from '$lib/components/nav-user.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import Command from 'lucide-svelte/icons/command';

  let { ref = $bindable(null), user, ...restProps } = $props();

  const data = {
    user: user,
    navMain: [
      {
        title: 'Playground',
        url: '#',
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: 'History',
            url: '#'
          },
          {
            title: 'Starred',
            url: '#'
          },
          {
            title: 'Settings',
            url: '#'
          }
        ]
      },
      {
        title: 'Models',
        url: '#',
        icon: Bot,
        items: [
          {
            title: 'Genesis',
            url: '#'
          },
          {
            title: 'Explorer',
            url: '#'
          },
          {
            title: 'Quantum',
            url: '#'
          }
        ]
      },
      {
        title: 'Documentation',
        url: '#',
        icon: BookOpen,
        items: [
          {
            title: 'Introduction',
            url: '#'
          },
          {
            title: 'Get Started',
            url: '#'
          },
          {
            title: 'Tutorials',
            url: '#'
          },
          {
            title: 'Changelog',
            url: '#'
          }
        ]
      },
      {
        title: 'Settings',
        url: '#',
        icon: Settings2,
        items: [
          {
            title: 'General',
            url: '#'
          },
          {
            title: 'Team',
            url: '#'
          },
          {
            title: 'Billing',
            url: '#'
          },
          {
            title: 'Limits',
            url: '#'
          }
        ]
      }
    ],
    navSecondary: [
      {
        title: 'Language',
        url: '#',
        icon: Languages
      },
      {
        title: 'Feedback',
        url: '#',
        icon: Send
      }
    ],
    projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: Frame
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: ChartPie
      },
      {
        name: 'Travel',
        url: '#',
        icon: Map
      }
    ]
  };
</script>

<Sidebar.Root bind:ref variant="inset">
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="lg">
          {#snippet child({ props })}
            <a href="##" {...props}>
              <div
                class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
              >
                <Command class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Acme Inc</span>
                <span class="truncate text-xs">Enterprise</span>
              </div>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>
  <Sidebar.Content>
    <NavMain items={data.navMain} />
    <NavProjects projects={data.projects} />
    <NavSecondary items={data.navSecondary} class="mt-auto" />
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser {user} />
  </Sidebar.Footer>
</Sidebar.Root>

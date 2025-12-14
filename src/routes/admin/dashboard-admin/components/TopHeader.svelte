<header class="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm">
			<div class="flex items-center">
				<button
					onclick={toggleSidebar}
					class="mr-4 text-gray-500 focus:outline-none lg:hidden"
				>
					<svg
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
				
				<!-- Search Bar -->
				<div class="relative hidden sm:block">
					<span class="absolute inset-y-0 left-0 flex items-center pl-3">
						<svg class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
							<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</span>
					<input class="block w-full rounded-md border border-gray-100 bg-gray-50 py-2 pl-10 pr-3 leading-5 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" placeholder="Search..." type="search">
				</div>
			</div>

		</header>
import { Fragment, ReactNode } from 'react';

import MainNavigation from './main-navigation';

function Layout(props: { children: ReactNode }) {
	return (
		<Fragment>
			<MainNavigation />
			<main>{props.children}</main>
		</Fragment>
	);
}

export default Layout;

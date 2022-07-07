import { MENU_TYPE, PAGE_TYPE, SUB_MENU_TYPE, STATIC_TYPE } from "./constants";

export const getPlacement = (placement, type) => {
	let wrapPlacementCSS: any = {};
	let checkerPlacementCSS: any = { right: -24, top: 0, bottom: 0 };

	if (type) {
		switch (type) {
			case MENU_TYPE:
				checkerPlacementCSS = { left: 8, top: 0, bottom: 0 };
				break;
			case SUB_MENU_TYPE:
				checkerPlacementCSS = { left: 14, top: 0, bottom: 0 };
				break;
			case PAGE_TYPE:
				checkerPlacementCSS = { left: -10, top: -10 };
				break;
			case STATIC_TYPE:
				checkerPlacementCSS = { position: "static", marginLeft: 10 };
				break;
		}
	}

	if (placement) {
		if (typeof placement === "object") {
			checkerPlacementCSS = placement;
		} else {
			switch (placement) {
				case "left":
					checkerPlacementCSS = { left: -24, top: 0, bottom: 0 };
					break;
				case "space-between":
					wrapPlacementCSS = { justifyContent: placement };
					break;
			}
		}
	}

	return { wrapPlacementCSS, checkerPlacementCSS };
};

const findChildren = (tree, children = []) => {
	if (!tree || !tree.length) {
		return []
	}

	for (let i = 0; i < tree.length; i++) {
		const item = tree[i];
		// @ts-ignore
		children.push(item.annotationName, ...findChildren(item.subordinates));
	}

	return children;
};

export const findPermissionsInTree = (tree, annotation, parents, addParent) => {
	if (!tree || !tree.length) {
		return null;
	}

	for (let i = 0; i < tree.length; i++) {
		const item = tree[i];
		const newParents = addParent ? [...parents] : [];

		newParents.push(item.annotationName);

		if (item.annotationName === annotation) {
			const children = findChildren(item.subordinates);
			return [...newParents, ...children];
		}

		const subParents = findPermissionsInTree(item.subordinates, annotation, newParents, addParent);

		if (subParents) {
			return subParents;
		}
	}

	return null;
};

export const fromArrayToObj = (array, value = true) => {
	return (array || []).reduce((acc, item) => ({
		...acc,
		[item]: value
	}), {});
};


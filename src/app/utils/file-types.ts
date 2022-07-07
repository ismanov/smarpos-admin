const validImageExtensions = ["jpg", "jpeg", "bmp", "gif", "png"];
export const isImage = (filename: string) => {
	const extension = filename.substr((filename.lastIndexOf('.') +1));
	return validImageExtensions.indexOf(extension) !== -1;
};

export const isPdf = (filename: string) => {
	const extension = filename.substr((filename.lastIndexOf('.') +1));
	return extension === 'pdf';
};

export const isPdfOrImage = (filename: string) => isPdf(filename) || isImage(filename);
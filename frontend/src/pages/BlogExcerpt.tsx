import React, { useEffect } from 'react'
import { Text } from '@mantine/core';

const BlogExcerpt = ({ isLoading, blog }) => {
    const [content, setContent] = React.useState('');

    useEffect(() => {
        const extractTextFromHTML = (html) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;
            return tempDiv.textContent || tempDiv.innerText;
        };
        const extractedText = extractTextFromHTML(blog.content);
        setContent(blog.content.length > 100 ? extractedText.slice(0, 200) + '...' : extractedText);
    }, [isLoading]);

    return (
        <Text>{content}</Text>
    )
}

export default BlogExcerpt
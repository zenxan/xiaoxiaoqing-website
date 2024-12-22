document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel-inner');
    const images = carousel.querySelectorAll('img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    const totalImages = images.length;

    // 复制最后一张图片到开头，第一张图片到结尾
    const lastClone = images[totalImages - 1].cloneNode(true);
    const firstClone = images[0].cloneNode(true);
    carousel.insertBefore(lastClone, images[0]);
    carousel.appendChild(firstClone);

    // 初始位置设为1（因为前面添加了一张克隆图片）
    carousel.style.transform = 'translateX(-33.333%)';
    currentIndex = 1;

    // 创建轮播点
    const dotsContainer = document.querySelector('.carousel-dots');
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i + 1));
        dotsContainer.appendChild(dot);
    }

    function updateCarousel() {
        const offset = currentIndex * 33.333;
        carousel.style.transform = `translateX(-${offset}%)`;
        
        // 更新轮播点
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === (currentIndex - 1) % totalImages);
        });

        // 更新图片的激活状态
        const allImages = carousel.querySelectorAll('img');
        allImages.forEach((img, index) => {
            img.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        carousel.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        updateCarousel();
    }

    function nextSlide() {
        if (currentIndex >= totalImages + 1) return;
        currentIndex++;
        carousel.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        updateCarousel();

        // 当到达克隆图片时，无缝跳回开始
        if (currentIndex === totalImages + 1) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = 1;
                updateCarousel();
                setTimeout(() => {
                    carousel.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 10);
            }, 800);
        }
    }

    function prevSlide() {
        if (currentIndex <= 0) return;
        currentIndex--;
        carousel.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        updateCarousel();

        // 当到达克隆图片时，无缝跳到末尾
        if (currentIndex === 0) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = totalImages;
                updateCarousel();
                setTimeout(() => {
                    carousel.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 10);
            }, 800);
        }
    }

    // 监听过渡结束事件
    carousel.addEventListener('transitionend', () => {
        if (currentIndex === 0) {
            carousel.style.transition = 'none';
            currentIndex = totalImages;
            updateCarousel();
        }
        if (currentIndex === totalImages + 1) {
            carousel.style.transition = 'none';
            currentIndex = 1;
            updateCarousel();
        }
    });

    // 添加按钮事件监听
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // 自动轮播
    let autoplayInterval = setInterval(nextSlide, 1000);

    // 当用户与轮播图交互时暂停自动轮播
    const carousel_container = document.querySelector('.carousel');
    carousel_container.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    // 当用户离开轮播图时恢复自动轮播
    carousel_container.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 1000);
    });

    // 添加灯箱功能
    let currentImageIndex = 0;
    const galleryImages = document.querySelectorAll('.gallery-item img');

    function openLightbox(img) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
        
        // 获取当前图片索引
        currentImageIndex = Array.from(galleryImages).indexOf(img);
        
        // 防止页面滚动
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        document.getElementById('lightbox').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function changeLightboxImage(direction) {
        currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
        const lightboxImg = document.getElementById('lightbox-img');
        lightboxImg.src = galleryImages[currentImageIndex].src;
    }

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('lightbox').style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeLightboxImage(-1);
            if (e.key === 'ArrowRight') changeLightboxImage(1);
        }
    });

    // 对话框功能
    const chatToggle = document.querySelector('.chat-toggle');
    const chatBox = document.querySelector('.chat-box');
    const minimizeBtn = document.querySelector('.minimize-btn');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const notificationDot = document.querySelector('.notification-dot');

    // 自动显示欢迎消息
    setTimeout(() => {
        chatBox.classList.add('active');
        notificationDot.style.display = 'block';
    }, 2000);

    // 切换对话框显示
    chatToggle.addEventListener('click', () => {
        chatBox.classList.toggle('active');
        notificationDot.style.display = 'none';
    });

    // 最小化对话框
    minimizeBtn.addEventListener('click', () => {
        chatBox.classList.remove('active');
    });

    // 添加 KIMI API 相关配置
    const KIMI_API_KEY = 'sk-ZW2TVgV7jxyiwlw4bKzfXqzNP0XEZrREyKt9qwqFFHNuCIKZ';
    const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

    // 修改发送消息的函数
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // 添加用户消息
            addMessage(message, 'sent');
            messageInput.value = '';
            
            // 显示正在输入状态
            addTypingIndicator();

            try {
                // 调用 KIMI API
                const response = await fetchKimiResponse(message);
                removeTypingIndicator();
                addMessage(response, 'received');
            } catch (error) {
                removeTypingIndicator();
                addMessage('抱歉，我现在有点累了，待会再聊吧~ 😅', 'received');
                console.error('KIMI API Error:', error);
            }
        }
    }

    // 添加与 KIMI API 通信的函数
    async function fetchKimiResponse(message) {
        const maxRetries = 3;
        let retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                const response = await fetch(KIMI_API_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${KIMI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: [{
                            role: 'system',
                            content: '你是晓晴，一个活泼可爱的少女。你说话风格要可爱活泼，喜欢用表情符号。'
                        }, {
                            role: 'user',
                            content: message
                        }],
                        model: 'moonshot-v1-8k',
                        temperature: 0.7
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (!data.choices || !data.choices[0]) {
                    throw new Error('Invalid response format');
                }
                return data.choices[0].message.content;
            } catch (error) {
                retryCount++;
                if (retryCount === maxRetries) {
                    throw error;
                }
                // 等待一段时间后重试
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            }
        }
    }

    // 添加输入指示器
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message received typing';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 移除输入指示器
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // 添加消息到对话框
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text.trim()}</p>
            </div>
        `;
        messageDiv.innerHTML = messageDiv.innerHTML.replace(/^\s+|\s+$/g, '');
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 发送按钮点击事件
    sendBtn.addEventListener('click', sendMessage);

    // 回车发送消息
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 
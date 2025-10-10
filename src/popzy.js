Popzy.openingModals = []; // Mảng lưu các modal đang mở

function Popzy(options = {}) {
    // Xử lý options truyền vào:
    // Mặc định:
    //      - có 3 closeMethods = ['button', 'overlay', 'escape'] nếu caller không truyền đối số. Nếu caller truyền { closeMethods: ['button'] } thì chỉ có thể close modal bằng button
    //      - khoá scroll khi mở modal: enableSrcollLock: true,
    //      - không có footer: footer = false
    //      - không thêm class nào vào Modal container: cssClass = []
    //      - mặc định khi close sẽ gỡ khỏi DOM, nếu caller truyền 'destroyOnClose: false' thì sẽ không gỡ khỏi DOM

    this.opt = Object.assign(
        {
            closeMethods: ['button', 'overlay', 'escape'],
            enableSrcollLock: true,
            footer: false,
            cssClass: [],
            destroyOnClose: true,
            scrollLockTarget: () => document.body,
        },
        options
    );

    const { content, templateId, closeMethods } = this.opt;

    // Nếu người dùng truyền cả content và templateId thì sẽ in ra cảnh báo:
    if (content && templateId) {
        console.warn(
            `[${this.constructor.name}] Warning: both 'content' and 'templateId' provided — ` +
                `'content' will be used and 'templateId' will be ignored.`
        );
    }

    // Nếu không truyền thì typeof === 'undefined' -> không cần kiểm tra dài dòng: if (content && typeof content === 'string')
    // Ưu tiên lấy content. Nếu không có content thì lấy templateId
    if (typeof content === 'string' && content.trim() !== '') {
        this.content = content;
    } else if (typeof templateId === 'string') {
        this.template = document.getElementById(templateId);
    }

    // Validate: nếu cả 2 đều không có thì throw Error
    if (!this.content && !this.template) {
        const reason =
            typeof templateId === 'string'
                ? `Template "#${templateId}" not found in DOM`
                : `Provide non-empty 'content' (string) or a valid 'templateId' (string)`;

        throw new Error(`[${this.constructor.name}] Initialization failed: ${reason}.`);
    }

    this._allowButtonClose = closeMethods.includes('button');
    this._allowBackdropClose = closeMethods.includes('overlay');
    this._allowEscapeClose = closeMethods.includes('escape');

    this._isModalOpening = false; // Ban đầu chưa có modal nào đang mở

    this._footerButtons = [];

    this.escapeHandler = this.escapeHandler.bind(this);
}

// Hàm create element và tạo cấu trúc html + append vào DOM
Popzy.prototype.build = function () {
    const content = this.content || this.template.content.cloneNode(true);

    this._backdrop = document.createElement('div');
    this._backdrop.classList.add('popzy');

    const modalContainer = document.createElement('div');
    modalContainer.classList.add('popzy__container');
    this.opt.cssClass.forEach((className) => {
        if (typeof className === 'string') {
            modalContainer.classList.add(className);
        }
    });

    // Nếu closeMethods có 'button' thì mới cần tạo closeBtn element, append vào DOM và add listener
    if (this._allowButtonClose) {
        // Cần bọc trong arrow function và gọi this.close() để this trong hàm close luôn là instance của Modal, nếu truyền trực tiếp this.close sẽ làm this trong hàm close trỏ về closeBtn
        const closeBtn = this._createButton('&times;', 'popzy--close', () => {
            this.close();
        });

        modalContainer.append(closeBtn);
    }

    this._modalContent = document.createElement('div');
    this._modalContent.classList.add('popzy__content');

    // Tạo cấu trúc html & append vào DOM
    if (this.content) {
        this._modalContent.innerHTML = content;
    } else {
        this._modalContent.append(content);
    }
    modalContainer.append(this._modalContent);
    this._backdrop.append(modalContainer);
    document.body.append(this._backdrop);

    // Tạo footer element và gọi các hàm set footer nếu option footer = true
    if (this.opt.footer) {
        this._modalFooter = document.createElement('div');
        this._modalFooter.classList.add('popzy__footer');

        // Nếu gọi setFooterContent trước đó thì mới lọt vào đây
        if (this._footerContent) {
            this._modalFooter.innerHTML = this._footerContent;
        }
        // this._renderFooterContent(); // Có thể tối ưu code bằng cách tách riêng ra và gọi hàm this._renderFooterContent(), nhưng vì đang học JS nên làm như trên cho dễ nhìn và dễ hiểu

        this._renderFooterButtons();

        modalContainer.append(this._modalFooter);
    }

    // Add event listener xử lý close modal (chỉ remove listener khi gọi this.detroy())
    if (this._allowBackdropClose) {
        this._backdrop.addEventListener('click', (e) => {
            if (e.target === this._backdrop) {
                this.close();
            }
        });
    }
};

Popzy.prototype._hasScrollbar = function (target) {
    const html = document.documentElement;
    const body = document.body;

    if ([html, body].includes(target)) {
        return html.scrollHeight > html.clientHeight || body.scrollHeight > body.clientHeight;
    }

    return target.scrollHeight > target.clientHeight;
};

// Xử lý scroll cách theo bài học
Popzy.prototype._getScrollbarWidth = function () {
    // Nếu đã cache thì return giá trị đã cache, không cần thực hiện lại logic tính toán bên dưới
    if (this._scrollbarWidth) return this._scrollbarWidth;

    const div = document.createElement('div');
    div.style.overflow = 'scroll';
    div.style.position = 'absolute';
    div.style.top = '-9999px';

    document.body.appendChild(div);
    this._scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);

    return this._scrollbarWidth;
};

// Hàm create button (dùng cho cả close button và footer button)
Popzy.prototype._createButton = function (title, classListStr, action) {
    const button = document.createElement('button');
    button.innerHTML = title;

    if (typeof classListStr === 'string' && classListStr.length > 0) {
        classListStr.split(' ').forEach((className) => {
            button.classList.add(className);
        });
    }

    button.addEventListener('click', action);
    return button;
};

// Hàm set content
Popzy.prototype.setContent = function (content) {
    this.content = content;
    if (this._modalContent) {
        this._modalContent.innerHTML = content;
    }
};

// Hàm xử lý footer content
Popzy.prototype.setFooterContent = function (content = '<h4>This is default footer...</h4>') {
    // Nếu gọi setFooterContent() trước open() thì gán content vào thuộc tính, chỉ khi nào open thì mới tạo thẻ div.popzy__footer và gán innerHTML bằng thuộc tính đã tạo
    this._footerContent = content;

    // Ban đầu nếu chỉ gọi setFooterContent -> Không lọt vào đây vì chưa gọi open()
    // Nếu gọi setFooterContent() sau open(), thì lúc này đã có this._modalFooter (thẻ div rỗng đã được tạo trong hàm build khi open), vì thế gán innerHTML luôn)
    if (this._modalFooter) {
        this._modalFooter.innerHTML = content;
    }
    // this._renderFooterContent(); // Có thể tối ưu code bằng cách tách riêng ra và gọi hàm this._renderFooterContent(), nhưng vì đang học JS nên làm như trên cho dễ nhìn và dễ hiểu
};

// Hàm xử lý footer button
Popzy.prototype.addFooterButton = function (title, classListStr, action) {
    if (!this.opt.footer) return;

    // Nếu button có cùng title đã được append vào DOM thì return
    const isAppended = this._footerButtons.some((button) => {
        return button.innerHTML.trim() === title.trim() || button.innerText.trim() === title.trim();
    });

    if (isAppended) return;

    // Tạo footer button mỗi lần gọi hàm nếu không trùng
    const footerButton = this._createButton(title, classListStr, action);

    footerButton.classList.add('popzy__footer-button');

    this._footerButtons.push(footerButton);

    this._renderFooterButtons();
};

Popzy.prototype._renderFooterContent = function () {
    if (this._footerContent && this._modalFooter) {
        this._modalFooter.innerHTML = this._footerContent;
    }
};

Popzy.prototype._renderFooterButtons = function () {
    if (this._modalFooter) {
        this._footerButtons.forEach((button) => {
            this._modalFooter.append(button);
        });
    }
};

// Hàm xử lý press 'Escape' riêng, mục đích có tham chiếu để remove event
Popzy.prototype.escapeHandler = function (e) {
    const lastOpenedModal = Popzy.openingModals.slice(-1)[0];
    if (e.key === 'Escape') {
        if (lastOpenedModal && lastOpenedModal === this) this.close();
    }
};

// Hàm open modal
Popzy.prototype.open = function () {
    // Đóng modal cũ nếu có
    if (this._isModalOpening) this.close();

    if (!this._backdrop) {
        //  Nếu chưa có this._backdrop -> create element, tạo cấu trúc html và append vào DOM
        this.build();
    }

    Popzy.openingModals.push(this);

    // Thêm class 'show' để hiển thị, setTimeout để có animation
    setTimeout(() => {
        this._backdrop.classList.add('popzy--show');
    }, 0);

    // Xử lý scroll theo bài học
    if (this.opt.enableSrcollLock) {
        const target = this.opt.scrollLockTarget();

        // Chỉ xử lý nếu có scrollbar và chỉ xử lý modal mở đầu tiên (tránh cộng dồn padding)
        if (Popzy.openingModals.length === 1 && this._hasScrollbar(target)) {
            target.classList.add('popzy--no-scroll');

            const currentPaddingRight = parseFloat(getComputedStyle(target).paddingRight);
            target.style.paddingRight = currentPaddingRight + this._getScrollbarWidth() + 'px';
        }
    }

    // Xử lý scroll cách 2
    // const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    // document.body.classList.add('no-scroll');
    // document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Thực hiện logic khi mở modal (logic định nghĩa khi tạo instance)
    this._backdrop.addEventListener(
        'transitionend',
        () => {
            typeof this.opt.onOpen === 'function' && this.opt.onOpen();

            // Cập nhật isModalOpening
            this._isModalOpening = true;
        },
        { once: true }
    );

    // Riêng escape để đóng modal thì phải add vào lúc open và gỡ lúc close, vì listener được gán trên document (có thể ảnh hưởng tới các modal khác nếu destroyOnClose = false)
    if (this._allowEscapeClose) {
        // Nếu không bọc trong arrow function thì cần bind this ở đây hoặc bind lúc khai báo hàm escapeHandler
        // Nhưng nếu bọc trong arrow function hoặc bind this ở đây thì sẽ tạo ra hàm mới mỗi lần mở modal, không thể gỡ event được
        // Vì thế chỉ còn cách bind this lúc khai báo hàm escapeHandler để cùng tham chiếu đến một hàm và có thể gỡ event
        // Hoặc trong hàm tạo modal tạo một hàm this._boundEscapeHandler tham chiếu tới this.escapeHandler rồi truyền vào đây
        document.addEventListener('keydown', this.escapeHandler);
    }

    // return để caller bên ngoài có thể nhận và truy cập các element bên trong backdrop
    return this._backdrop;
};

// Hàm close modal
Popzy.prototype.close = function (shouldDestroy = this.opt.destroyOnClose) {
    // Logic chỉ xử lý nếu có modal đang mở
    if (!this._isModalOpening) return;

    Popzy.openingModals.pop();

    // Ẩn khỏi UI (vẫn còn trong DOM)
    this._backdrop.classList.remove('popzy--show');

    // Gỡ khỏi DOM theo mặc định (sau khi chạy xong animation)
    let timeoutId = null;
    this._backdrop.addEventListener(
        'transitionend',
        (e) => {
            // Thực hiện logic khi đóng modal (logic định nghĩa khi tạo instance)
            typeof this.opt.onClose === 'function' && this.opt.onClose();
            // Cập nhật isModalOpening sau khi chạy xong animation
            this._isModalOpening = false;

            // Khôi phục scroll và padding-right nếu không còn modal nào đang mở
            if (!Popzy.openingModals.length && this.opt.enableSrcollLock) {
                const target = this.opt.scrollLockTarget();

                if (this._hasScrollbar(target)) {
                    target.classList.remove('popzy--no-scroll');
                    target.style.paddingRight = ''; // gán chuỗi rỗng để gỡ khỏi DOM thay vì gán 0px
                }
            }

            if (shouldDestroy && this._backdrop) {
                this._backdrop.remove();
                this._backdrop = null;
                this._modalFooter = null; // Nếu không gỡ thì sẽ không có lỗi ngay lập tức, nhưng nên gỡ để tránh lỗi tiềm ẩn khi thao tác với footer sau này và tránh memory leak
            }

            // remove listener tránh memory leak
            document.removeEventListener('keydown', this.escapeHandler);
            // Clear fallback
            clearTimeout(timeoutId);
        },
        { once: true }
    );

    // Fallback Gỡ khỏi DOM nếu không có transition
    timeoutId = setTimeout(() => {
        if (shouldDestroy && this._backdrop) {
            this._backdrop.remove();
            this._backdrop = null;
        }
    }, 1000);
};

// Hàm destroy modal
Popzy.prototype.destroy = function () {
    if (!this._backdrop) return;

    this.close(true);
};

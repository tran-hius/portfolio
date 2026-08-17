# Custom Cursor — Mix Blend Difference

Hãy thêm một **custom cursor effect** hiện đại cho toàn bộ portfolio website hiện tại.

## Yêu cầu chính

Tạo một cursor hình tròn màu trắng, kích thước khoảng **70–90px**, luôn đi theo vị trí chuột.

Cursor phải sử dụng:

```css
mix-blend-mode: difference;
```

để tạo hiệu ứng đảo màu theo background/content phía dưới:

* Trên nền đen → cursor hiển thị màu trắng.
* Khi đi qua text/icon màu trắng → vùng cursor biến thành màu đen.
* Khi đi qua các màu khác → tự động tạo màu tương phản theo cơ chế `difference`.
* Hiệu ứng phải giống kiểu custom cursor trên các portfolio website creative/developer cao cấp.

## Chuyển động

Không được để cursor bám chuột cứng.

Hãy tạo chuyển động **smooth / lag nhẹ**:

* Cursor chính follow chuột bằng interpolation/lerp.
* Có một chút delay khoảng 50–100ms tạo cảm giác mượt.
* Không được delay quá nhiều.
* Không được gây cảm giác cursor bị giật.

Có thể sử dụng `requestAnimationFrame`, GSAP hoặc Framer Motion nếu project hiện tại đã sử dụng chúng. **Ưu tiên tận dụng dependency hiện có, không cài thêm thư viện nếu không cần thiết.**

## Interaction

Cursor phải:

1. Bình thường:

   * Hình tròn trắng.
   * `pointer-events: none`.
   * Luôn nằm trên UI nhưng vẫn blend với nội dung bên dưới.

2. Khi hover text/link/button:

   * Cursor có thể scale nhẹ lên khoảng `1.2–1.5`.
   * Transition phải mượt.

3. Khi hover project/card:

   * Scale cursor lớn hơn một chút.
   * Có thể hiển thị một text nhỏ như `VIEW` / `OPEN` ở giữa cursor nếu phù hợp với design hiện tại.

4. Khi rời khỏi viewport:

   * Cursor fade out.
   * Khi quay lại viewport thì fade in.

## Technical requirements

* Không phá vỡ cursor mặc định trên mobile/tablet.
* **Chỉ activate custom cursor trên thiết bị có mouse/pointer chính xác**, ví dụ dùng media query:
  `@media (pointer: fine)`.
* Mobile/tablet phải giữ cursor mặc định.
* Không làm ảnh hưởng đến `click`, `hover`, `pointer-events` hoặc accessibility.
* Không làm layout shift.
* Không gây memory leak.
* Cleanup toàn bộ event listeners khi component unmount.
* Không tạo quá nhiều DOM elements.
* Tối ưu animation bằng `requestAnimationFrame` hoặc cơ chế tương đương.
* Cursor phải có `z-index` đủ cao nhưng không được che hoặc phá interaction của UI.

## Visual style

Giữ nguyên design hiện tại của portfolio.

Cursor cần mang cảm giác:

**minimal / premium / futuristic / editorial / creative developer portfolio**

Không thêm shadow, gradient hoặc màu sắc sặc sỡ nếu không cần thiết.

Hiệu ứng quan trọng nhất là:

**white circular cursor + `mix-blend-mode: difference`**

Ví dụ CSS concept:

```css
.custom-cursor {
  position: fixed;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  pointer-events: none;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
```

## Implementation

Trước khi code:

1. Kiểm tra architecture hiện tại.
2. Xác định framework/component structure đang sử dụng.
3. Tìm nơi phù hợp nhất để mount global cursor.
4. Không tạo implementation trùng với cursor/animation system hiện tại nếu project đã có.

Sau đó implement hoàn chỉnh.

Cuối cùng kiểm tra:

* Desktop mouse movement.
* Hover text trắng trên nền đen.
* Hover background sáng.
* Hover button/link.
* Hover project.
* Scroll page.
* Resize window.
* Rời khỏi viewport.
* Mobile/tablet.
* Không có console error.

**Không thay đổi design/layout hiện tại ngoài việc bổ sung custom cursor effect.**

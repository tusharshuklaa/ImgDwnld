var GetImage;
(function (GetImage) {
    class GetImg {
        constructor() {
            this._imageDownloadList = [];
            this._selectedImgCount = 0;
            this._allImagesCount = 0;
            let self = this;
            self.showLoader();
            self.injectStrcuture().then(() => {
                document.getElementById("_giSelAllBtn").addEventListener("click", () => {
                    self.gi_toggleSelectAllImages();
                }, false);
                self.getAllImages().then((images) => {
                    self.injectImages(images);
                    var _selector = document.querySelectorAll(".giImgMetaInfo");
                    self._allImagesCount = _selector.length;
                    document.getElementById("giTotalImgs").innerText = self._allImagesCount.toString();
                    Array.from(_selector).forEach(imgMeta => {
                        imgMeta.addEventListener('click', (e) => {
                            e.stopImmediatePropagation();
                            let chkBox = e.srcElement.firstElementChild;
                            if (chkBox.checked) {
                                chkBox.checked = false;
                                self.manageImageDownloadList(chkBox, false);
                            }
                            else {
                                chkBox.checked = true;
                                self.manageImageDownloadList(chkBox, true);
                            }
                        });
                        self.removeLoader();
                    });
                });
            });
        }
        injectStrcuture() {
            return new Promise((resolve) => {
                let getImgOverlay = document.createElement("div");
                getImgOverlay.id = "getImgOverlay";
                let internalElem = "" +
                    "<div class=\"giMainBody\">" +
                    "<div class=\"giHeader\">" +
                    "<div class=\"giMultiSelect\">" +
                    "<span id=\"giSelected\">0</span>/<span id=\"giTotalImgs\">0</span>" +
                    "</div>" +
                    "<button id=\"_giSelAllBtn\">Select All</button>" +
                    "<input type=\"checkbox\" id=\"gi_selectAllImgs\" />" +
                    "<span id=\"giCloseBtn\">X</span>" +
                    "</div>" +
                    "<div id=\"giBody\"></div>" +
                    "</div>";
                getImgOverlay.innerHTML = internalElem;
                document.getElementsByTagName("body")[0].appendChild(getImgOverlay);
                return resolve(true);
            });
        }
        showLoader() {
            let parentElem = document.getElementById("getImgOverlay"), giSpinner = document.getElementById("getImgSpinner");
            if (parentElem && !giSpinner) {
                let loader = document.createElement("div");
                loader.id = "getImgSpinner";
                loader.className = "spinner";
                loader.innerHTML = "<div class=\"double-bounce1\"></div>" +
                    "<div class=\"double-bounce2\"></div>";
                parentElem.appendChild(loader);
            }
        }
        removeLoader() {
            let spinner = document.getElementById("getImgSpinner");
            if (spinner)
                spinner.parentNode.removeChild(spinner);
        }
        getBestImg(imgUrl) {
            let maxImgSize = 1, imgStack = imgUrl.split(',');
            imgStack.map((url, index, currArr) => {
                var imgContent = url.trim().split(/ /);
                var imgSize = parseFloat(imgContent[1].substring(0, imgContent[1].length - 1));
                if (imgSize > maxImgSize) {
                    imgUrl = imgContent[0];
                    maxImgSize = imgSize;
                }
            });
            return imgUrl;
        }
        checkImgUrl(url) {
            let urlSets = ["http", "https", "www", "data:image", ".jpg", ".png", ".jpeg", ".gif", ".svg", ".bmp", ".ico"];
            if (new RegExp(urlSets.join("|")).test(url))
                return true;
            else
                return false;
        }
        getAllImages() {
            var allImages = [];
            return new Promise((resolve) => {
                let self = this, allImg = document.querySelectorAll("img"), images = [].slice.call(allImg), allBgImgs = document.querySelectorAll("*"), bgImgs = [].slice.call(allBgImgs);
                // Iterate over all images and take its SRC and push it in main array
                images.forEach((img, index) => {
                    let imgUrl = img.getAttribute("srcset");
                    if (imgUrl) {
                        imgUrl = self.getBestImg(imgUrl);
                    }
                    else {
                        imgUrl = img.getAttribute("src");
                    }
                    if (self.checkImgUrl(imgUrl))
                        allImages.push(imgUrl);
                });
                //Iterate over all visible elements ad check if the have background-image and then push them in main array
                bgImgs.forEach((img, index) => {
                    var bgImgUrl = img.style.backgroundImage;
                    if (bgImgUrl && self.checkImgUrl(bgImgUrl)) {
                        allImages.push(bgImgUrl);
                    }
                });
                resolve(allImages);
            });
        }
        injectImages(images) {
            let self = this;
            images.forEach((url, index, array) => {
                let imgContainer = document.createElement("div");
                imgContainer.className = "giImgBody";
                imgContainer.innerHTML = "" +
                    "<img src=" + url + " />" +
                    "<div class=\"giImgMetaInfo\">" +
                    "<input type=\"checkbox\" class=\"_gi_Images\" data-imgurl=\"" + url + "\" />" +
                    "</div>";
                document.getElementById("giBody").appendChild(imgContainer);
            });
        }
        updateSelectedCount() {
            let self = this, gi_selectAllChkBox = document.getElementById("gi_selectAllImgs");
            self._selectedImgCount = self._imageDownloadList.length;
            document.getElementById("giSelected").innerText = self._selectedImgCount.toString();
            let _selectAllBtn = document.getElementById("_giSelAllBtn");
            if (self._allImagesCount === self._selectedImgCount) {
                _selectAllBtn.innerText = "Deselect All";
                gi_selectAllChkBox.checked = true;
            }
            else {
                _selectAllBtn.innerText = "Select All";
                gi_selectAllChkBox.checked = false;
            }
        }
        manageImageDownloadList(elem, chk) {
            let self = this, img = elem.getAttribute("data-imgurl"), imgIndex = self._imageDownloadList.indexOf(img);
            if (chk) {
                if (imgIndex === -1) {
                    self._imageDownloadList.push(img);
                    elem.parentElement.parentElement.className += " selectedGiImg";
                }
            }
            else {
                if (imgIndex > -1) {
                    self._imageDownloadList.splice(imgIndex, 1);
                    elem.parentElement.parentElement.classList.remove("selectedGiImg");
                }
            }
            self.updateSelectedCount();
        }
        gi_toggleSelectAllImages() {
            let self = this, allImages = document.getElementsByClassName("giImgMetaInfo"), allImgChkBoxes = document.getElementsByClassName("_gi_Images"), gi_selectAllChkBox = document.getElementById("gi_selectAllImgs");
            if (!gi_selectAllChkBox.checked) {
                for (let i = 0; i < allImgChkBoxes.length; i++) {
                    let imgChkBox = allImgChkBoxes[i];
                    imgChkBox.checked = true;
                    self.manageImageDownloadList(imgChkBox, true);
                }
                gi_selectAllChkBox.checked = true;
            }
            else {
                for (let i = 0; i < allImgChkBoxes.length; i++) {
                    let imgChkBox = allImgChkBoxes[i];
                    imgChkBox.checked = false;
                    self.manageImageDownloadList(imgChkBox, false);
                }
                gi_selectAllChkBox.checked = false;
            }
            self.updateSelectedCount();
        }
    }
    GetImage.GetImg = GetImg;
})(GetImage || (GetImage = {}));
var runGetImg = runGetImg || new GetImage.GetImg();
//# sourceMappingURL=getImg.js.map
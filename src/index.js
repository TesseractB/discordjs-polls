"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var src_1 = require("discord.js/src");
var Poll = /** @class */ (function () {
    function Poll(options) {
        this.client = options.client;
        this.message = options.message || null;
        this.title = options.title;
        this.description = options.description || "";
        this.color = options.color || "GOLD";
        this.itemlist = options.itemlist;
        this.emojilist = options.emojilist || [
            "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟",
            "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿",
        ];
        this.endDate = options.endDate;
        this.anonymous = options.anonymous || false;
        this.allowMultiple = options.allowMultiple || false;
    }
    Poll.prototype.start = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var voters, totalVotes, embed, i;
            var _this = this;
            return __generator(this, function (_a) {
                voters = new Set();
                totalVotes = 0;
                if (this.endDate.getTime() - Date.now() > 1209600000) {
                    throw new Error("End date is more than 2 weeks away");
                }
                embed = new src_1["default"].MessageEmbed();
                embed.setTitle(this.title);
                embed.setDescription(this.anonymous ? "This poll is anonymous. You cannot take back your vote once casted.\n" + this.description : this.description);
                if (this.itemlist.length > this.emojilist.length) {
                    throw new Error("Emojilist is not long enough to support all items");
                }
                for (i = 0; i < this.itemlist.length; i++) {
                    embed.addField("".concat(this.emojilist[i], " ").concat(this.itemlist[i]), "`                    ` | 0% (0)");
                }
                embed.setColor(this.color);
                embed.setFooter({ text: "Ends ".concat(this.endDate.toLocaleString()) });
                channel.send({ content: this.message, embeds: [embed] })
                    .then(function (msg) { return __awaiter(_this, void 0, void 0, function () {
                    var i, filter, collector;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < this.itemlist.length)) return [3 /*break*/, 4];
                                return [4 /*yield*/, msg.react(this.emojilist[i])];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3 /*break*/, 1];
                            case 4:
                                filter = function (reaction, user) { return _this.emojilist.includes(reaction.emoji.name); };
                                collector = msg.createReactionCollector({ filter: filter, time: this.endDate.getTime() - Date.now() });
                                collector.on("collect", function (reaction, user) { return __awaiter(_this, void 0, void 0, function () {
                                    var index, field, votes, arr, _i, _a, field_1, fieldVotes;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (!this.allowMultiple && voters.has(user.id)) {
                                                    return [2 /*return*/, reaction.users.remove(user)];
                                                }
                                                if (!voters.has(user.id)) {
                                                    voters.add(user.id);
                                                }
                                                if (this.anonymous) {
                                                    reaction.users.remove(user);
                                                }
                                                index = this.emojilist.indexOf(reaction.emoji.name);
                                                if (!(index !== -1)) return [3 /*break*/, 2];
                                                field = msg.embeds[0].fields[index];
                                                votes = parseInt(field.value.split(" ").join("").slice(6, 7));
                                                votes++;
                                                totalVotes++;
                                                arr = "                    ".split("");
                                                field.value = "`".concat(arr.fill("█", 0, Math.round((votes / totalVotes) / 5) * 5).join(""), "` | ").concat(Math.round((votes / totalVotes) * 100), "% (").concat(votes, ")");
                                                for (_i = 0, _a = msg.embeds[0].fields; _i < _a.length; _i++) {
                                                    field_1 = _a[_i];
                                                    fieldVotes = parseInt(field_1.value.split(" ").join("").slice(6, 7));
                                                    field_1.value = "`".concat(arr.fill("█", 0, Math.round((fieldVotes / totalVotes) / 5) * 5).join(""), "` | ").concat(Math.round((fieldVotes / totalVotes) * 100), "% (").concat(fieldVotes, ")");
                                                }
                                                return [4 /*yield*/, msg.edit({ embeds: [msg.embeds[0]] })];
                                            case 1:
                                                _b.sent();
                                                _b.label = 2;
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                collector.on("remove", function (reaction, user) { return __awaiter(_this, void 0, void 0, function () {
                                    var index, field, votes, arr, _i, _a, field_2, fieldVotes;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (this.anonymous) {
                                                    return [2 /*return*/];
                                                }
                                                if (!this.allowMultiple) {
                                                    if (voters.has(user.id)) {
                                                        voters["delete"](user.id);
                                                    }
                                                }
                                                index = this.emojilist.indexOf(reaction.emoji.name);
                                                if (!(index !== -1)) return [3 /*break*/, 2];
                                                field = msg.embeds[0].fields[index];
                                                votes = parseInt(field.value.split(" ").join("").slice(6, 7));
                                                votes--;
                                                totalVotes--;
                                                arr = "                    ".split("");
                                                field.value = "`".concat(arr.fill("█", 0, Math.round((votes / totalVotes) / 5) * 5).join(""), "` | ").concat(Math.round((votes / totalVotes) * 100), "% (").concat(votes, ")");
                                                for (_i = 0, _a = msg.embeds[0].fields; _i < _a.length; _i++) {
                                                    field_2 = _a[_i];
                                                    fieldVotes = parseInt(field_2.value.split(" ").join("").slice(6, 7));
                                                    field_2.value = "`".concat(arr.fill("█", 0, Math.round((fieldVotes / totalVotes) / 5) * 5).join(""), "` | ").concat(Math.round((fieldVotes / totalVotes) * 100), "% (").concat(fieldVotes, ")");
                                                }
                                                return [4 /*yield*/, msg.edit({ embeds: [msg.embeds[0]] })];
                                            case 1:
                                                _b.sent();
                                                _b.label = 2;
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                collector.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                                    var winner, embed, winnerVotes, _i, _a, field, votes;
                                    return __generator(this, function (_b) {
                                        msg.reactions.removeAll();
                                        winner = "";
                                        embed = msg.embeds[0];
                                        winnerVotes = 0;
                                        for (_i = 0, _a = embed.fields; _i < _a.length; _i++) {
                                            field = _a[_i];
                                            votes = parseInt(field.value.split(" ").join("").slice(6, 7));
                                            if (votes > winnerVotes) {
                                                winner = field.name;
                                                winnerVotes = votes;
                                            }
                                        }
                                        embed.footer = { text: "Ended at ".concat(this.endDate.toLocaleString()) };
                                        embed.description = "The poll has ended. The winner is: ".concat(winner);
                                        msg.edit({ embeds: [embed] });
                                        return [2 /*return*/];
                                    });
                                }); });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return Poll;
}());
exports["default"] = Poll;

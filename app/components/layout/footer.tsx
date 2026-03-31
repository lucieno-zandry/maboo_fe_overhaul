import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Facebook, Mail, Phone, MessageCircle } from "lucide-react";

export default function Footer() {
    const { t } = useTranslation("common");

    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    {/* Logo & Tagline */}
                    <div className="flex flex-col gap-4">
                        <Link to="/" className="block">
                            <img 
                                src="/maboo-logo.jpg" 
                                alt="Maboo" 
                                className="h-16 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-gray-600 text-lg font-medium">
                            {t("footer.tagline")}
                        </p>
                    </div>

                    {/* Plus sur Ma Boo */}
                    <div>
                        <h6 className="text-lg font-bold text-gray-900 mb-6">
                            {t("footer.more.title")}
                        </h6>
                        <ul className="space-y-4">
                            <li>
                                <Link to="#" className="text-gray-600 hover:text-primary transition-colors">
                                    {t("footer.more.items.about")}
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-600 hover:text-primary transition-colors">
                                    {t("footer.more.items.blog")}
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-600 hover:text-primary transition-colors">
                                    {t("footer.more.items.forums")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Payer avec */}
                    <div>
                        <h6 className="text-lg font-bold text-gray-900 mb-6">
                            {t("footer.payment.title")}
                        </h6>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-600">
                                <img src="/assets/icons/Mvola.png" alt="Mvola" className="h-8 w-auto object-contain" />
                                <span>Mvola</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600">
                                <img src="/assets/icons/orange-money.jpeg" alt="Orange Money" className="h-8 w-auto object-contain rounded" />
                                <span>Orange Money</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600">
                                <img src="/assets/icons/airtel-money.png" alt="Airtel Money" className="h-8 w-auto object-contain" />
                                <span>Airtel Money</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contactez-nous */}
                    <div>
                        <h6 className="text-lg font-bold text-gray-900 mb-6">
                            {t("footer.contact.title")}
                        </h6>
                        <ul className="space-y-4">
                            <li>
                                <a 
                                    href="https://www.facebook.com/mg.maboo" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                    <span>Facebook</span>
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://wa.me/261341585611" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>WhatsApp</span>
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="tel:+261341585611"
                                    className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>+261 34 15 856 11</span>
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="mailto:contact.ma.boo@gmail.com"
                                    className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span>contact.ma.boo@gmail.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-16 pt-8 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} Maboo. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
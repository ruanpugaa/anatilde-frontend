// Dentro do componente Sidebar.tsx
const threshold = 100;
const missingValue = threshold - totalCartValue;
const progressPercentage = (totalCartValue / threshold) * 100;

{
    totalCartValue > 0 && totalCartValue < threshold && (
        <div className="p-4 bg-pink-50 rounded-lg mb-4">
            <p className="text-sm text-pink-700">
                Faltam <strong>R$ {missingValue.toFixed(2)}</strong> para você ganhar 10% de desconto!
            </p>
            <div className="w-full bg-gray-200 h-2 mt-2 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="bg-pink-500 h-full"
                />
            </div>
        </div>
    )
}